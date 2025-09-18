import { AuthTokens } from '#contracts/types/auth_types'
import {
  SignUpResponsePayload,
  VerifyOtpResponsePayload,
} from '#contracts/types/payload/auth_payloads'

export default abstract class BaseAuthService {
  abstract signUp(payload: object): Promise<SignUpResponsePayload>

  abstract verifyOtp(otpId: string, otpCode: string): Promise<VerifyOtpResponsePayload>

  abstract singIn(payload: object): Promise<AuthTokens>

  abstract checkToken(xUserAccess: string): Promise<void>

  abstract refreshToken(xUserAccess: string): Promise<void>

  abstract forgotPassword(phone: string): Promise<VerifyOtpResponsePayload>

  abstract resetPassword(password: string, xUserAccess: string): Promise<void>

  abstract logout(payload: object): Promise<void>
}
