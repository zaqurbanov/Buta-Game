import vine from '@vinejs/vine'

export const signUpRequest = vine.object({
  email: vine.string(),
  password: vine.string().optional(),
})

export const verifyOtpRequest = vine.object({
  otpCode: vine.string().fixedLength(6),
})

export const signInRequest = vine.object({
  email: vine.string(),
  password: vine.string().minLength(3),
})

export const setPinRequest = vine.object({
  pinCode: vine.string().fixedLength(6),
})

export const forgotPasswordRequest = vine.object({
  email: vine.string(),
})

export const resetPasswordRequest = vine.object({
  password: vine.string(),
  token: vine.string(),
})

