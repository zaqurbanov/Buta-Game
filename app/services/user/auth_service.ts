import {inject} from '@adonisjs/core'
import type {HttpContext} from '@adonisjs/core/http'
import BaseValidatorService from '#contracts/services/base_validator_service'
import CustomerService from '#services/user/customer_service'
import {
    forgotPasswordRequest,
    resetPasswordRequest,
    signInRequest,
    signUpRequest, verifyOtpRequest,
} from '#schemas/auth_schemas'
import {SignInRequest, SignUpPayload, VerifyOtpPayload} from '#contracts/types/payload/auth_payloads'
import BadException from '#exceptions/bad_exception'
import {AuthMethod} from '#contracts/enums/static'
import JWTService from '#services/core/jwt_service'
import {NotificationService} from "#services/core/notification_service";
import UserCrudService from "#services/user/user_crud_service";

@inject()
export default class AuthService {
    constructor(
        protected validator: BaseValidatorService,
        protected customerService: CustomerService,
        protected adminService: UserCrudService,
        protected jwtService: JWTService,
        protected notificationService: NotificationService
    ) {
    }

    async signUp({request}: HttpContext) {
        const payload = await this.validateSingUpRequest(request.body())
        const authMethod = request.header('auth-method') as AuthMethod
        let user = await this.validateUserExists(payload.email, authMethod)

        if (user?.isVerified) {
            throw new BadException('User is already existing ')
        }


        if (!user && authMethod === AuthMethod.CUSTOMER) {
            user = await this.customerService.createUser(payload)
        } else if (user && authMethod === AuthMethod.ADMIN) {
            user = await this.adminService.updateUser(user?.id||0,payload)
        }

        const otp = this.jwtService.generateOtpCode(6)
        const otpToken = this.jwtService.generateOtpToken({
            otp,
            userId: user?.id as number,
            authMethod
        })

        await this.notificationService.sendOtp(payload.email, {otp, otpToken})

        return {success: true}
    }

    async validateSingUpRequest(data: Record<string, any>): Promise<SignUpPayload> {
        await this.validator.validate(signUpRequest, data)
        return data as SignUpPayload
    }

    async validateUserExists(email: string, authMethod?: string, isLogin?: boolean) {
        if (!authMethod) {
            throw new BadException('Auth Method is required')
        }
        let user

        if (authMethod == AuthMethod.CUSTOMER) {
            if (isLogin) {
                return await this.customerService.userExists(email)
            }
            user = await this.customerService.getUser('email', email)
        } else if (authMethod == AuthMethod.ADMIN) {
            user = await this.adminService.userExists(email)
        }


        return user
    }

    async verifyUser({request}: HttpContext) {
        const otpCode = request.header('otp-code');
        const payload = await this.validateVerifyOtpRequest({otpCode})
        const otpTokenHeader = request.header('otp-token');
        if (!otpTokenHeader) {
            throw new BadException('OTP token header is missing');
        }

        const otpResponse = this.jwtService.verifyOtpToken(otpTokenHeader);

        if (otpResponse.otp !== payload.otpCode) {
            throw new BadException('OTP code is not valid');
        }

        if (otpResponse.authMethod == AuthMethod.CUSTOMER) {
            await this.customerService.verifyUser(otpResponse.userId)

        }

        return {success: true}

    }

    async validateVerifyOtpRequest(data: Record<string, any>): Promise<VerifyOtpPayload> {
        await this.validator.validate(verifyOtpRequest, data)
        return data as VerifyOtpPayload
    }

    async signIn({request}: HttpContext) {
        const authMethod: AuthMethod = request.header('auth-method') as AuthMethod

        const payload = await this.validateSignInRequest(request.body(), authMethod)
        let user = await this.validateUserExists(payload.email, authMethod,true)
        if (!user) {
            throw new BadException('User not found')
        }

        let existsUser
        if (authMethod == AuthMethod.CUSTOMER) {
            existsUser = await this.customerService.login(payload.email, payload.password)
        } else if (authMethod == AuthMethod.ADMIN) {
            existsUser = await this.adminService.login(payload.email, payload.password)
        }
        const accessToken = this.jwtService.generateAccessToken({
            userId: existsUser?.id as number,
            authMethod: authMethod,
        })

        const refreshToken = this.jwtService.generateRefreshToken({
            userId: existsUser?.id as number,
            authMethod: authMethod,
        })
        return {accessToken, refreshToken}
    }

    async validateSignInRequest(
        data: Record<string, any>,
        authMethod?: string
    ): Promise<SignInRequest> {
        await this.validator.validate(signInRequest, data)

        if (!authMethod) {
            throw new BadException('Auth Method is requerid')
        }
        return data as SignInRequest
    }

    async forgotPassword({request}: HttpContext) {
        const authMethod: AuthMethod = request.header('auth-method') as AuthMethod
        if (!authMethod) {
            throw new BadException('Auth Method is required')
        }

        await this.validator.validate(forgotPasswordRequest, request.body())

        let user
        if (authMethod == AuthMethod.CUSTOMER) {
            user = await this.customerService.userExists(request.body().email)
        } else if (authMethod == AuthMethod.ADMIN) {
            user = await this.adminService.userExists(request.body().email)
        }

        const exception = new BadException('User is not found')
        if (!user) {
            throw exception
        }

        const token = this.jwtService.generateForgotPasswordToken({
            userId: user.id,
            authMethod
        })

        await this.notificationService.sendForgotPassword(request.body().email, token)

    }

    async resetPassword({request}: HttpContext) {
        const password = request.body().password
        const token = request.header('token') ?? ''
        await this.validator.validate(resetPasswordRequest, {password, token})
        const tokenPayload = this.jwtService.verifyForgotPasswordToken(token)

        if (tokenPayload.authMethod === AuthMethod.CUSTOMER) {
            await this.customerService.updateUser(tokenPayload.userId, {password})
        } else if (tokenPayload.authMethod === AuthMethod.ADMIN) {
            await this.adminService.updateUser(tokenPayload.userId, {password})
        }

        return {success: true}
    }

    async refreshToken({request}: HttpContext) {
        const token = request.header('refresh-token') ?? ''
        const refreshResponse = this.jwtService.verifyRefreshToken(token);
        if (refreshResponse.authMethod === AuthMethod.CUSTOMER) {
            await this.customerService.getUserOrFail('id', refreshResponse.userId)
        } else if (refreshResponse.authMethod === AuthMethod.ADMIN) {
            await this.adminService.getUserOrFail('id', refreshResponse.userId)
        }

        return await this.jwtService.rotateRefreshToken(token)


    }

}
