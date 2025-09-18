export type SignUpPayload = {
  password: string
  email: string
}

export type SignUpResponsePayload = {
  otpId: string
}

export type VerifyOtpPayload = {
  otpCode: string
}

export type VerifyOtpResponsePayload = {
  success: boolean
  authToken: string
  setPin: true
}

export type SignInRequest = {
  email: string
  password: string
}