import jwt, {JwtPayload} from 'jsonwebtoken'
import {AuthMethod} from '#contracts/enums/static'
import env from '#start/env'

export interface TokenPayload {
    userId: number
    authMethod: AuthMethod
}

export default class JWTService {
    private readonly accessTokenSecret = env.get('ACCESS_TOKEN_SECRET', 'ACCESS_SECRET')
    private readonly refreshTokenSecret = env.get('REFRESH_TOKEN_SECRET', 'REFRESH_SECRET')
    private readonly otpTokenSecret = env.get('OTP_TOKEN_SECRET', 'OTP_SECRET')
    private readonly forgotPasswordSecret = env.get('FORGOT_PASSWORD_SECRET', 'FORGOT_PASSWORD_SECRET')

    private readonly accessTokenExpiresIn = env.get('ACCESS_TOKEN_EXPIRES_IN', '15m')
    private readonly refreshTokenExpiresIn = env.get('REFRESH_TOKEN_EXPIRES_IN', '7d')
    private readonly otpTokenExpiresIn = env.get('OTP_TOKEN_EXPIRES_IN', '5m')
    private readonly forgotPasswordExpiresIn = env.get('FORGOT_PASSWORD_EXPIRES_IN', '5m')

    private signToken<T extends object>(payload: T, secret: string, expiresIn: string): string {
        // @ts-ignore
        return jwt.sign(payload, secret, {expiresIn})
    }

    private verifyToken<T extends JwtPayload>(token: string, secret: string): T {
        try {
            return jwt.verify(token, secret) as T
        } catch {
            throw new Error('Invalid or expired token')
        }
    }

    generateAccessToken(payload: TokenPayload) {
        return this.signToken(payload, this.accessTokenSecret, this.accessTokenExpiresIn)
    }

    verifyAccessToken(token: string) {
        return this.verifyToken<TokenPayload>(token, this.accessTokenSecret)
    }

    generateRefreshToken(payload: TokenPayload) {
        return this.signToken(payload, this.refreshTokenSecret, this.refreshTokenExpiresIn)
    }

    verifyRefreshToken(token: string) {
        return this.verifyToken<TokenPayload>(token, this.refreshTokenSecret)
    }

    async rotateRefreshToken(token: string) {
        const {authMethod, userId} = this.verifyRefreshToken(token)
        return {
            accessToken: this.generateAccessToken({authMethod, userId}),
            refreshToken: this.generateRefreshToken({authMethod, userId}),
        }
    }

    generateOtpToken(payload: TokenPayload & { otp: string }) {
        return this.signToken(payload, this.otpTokenSecret, this.otpTokenExpiresIn)
    }

    verifyOtpToken(token: string) {
        return this.verifyToken<TokenPayload & { otp: string }>(token, this.otpTokenSecret)
    }

    generateOtpCode(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        return Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    }

    generateForgotPasswordToken(payload: TokenPayload) {
        return this.signToken(payload, this.forgotPasswordSecret, this.forgotPasswordExpiresIn)
    }

    verifyForgotPasswordToken(token: string) {
        return this.verifyToken<TokenPayload>(token, this.forgotPasswordSecret)
    }
}
