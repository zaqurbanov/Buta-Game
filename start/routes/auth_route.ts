import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth/auth_controller'

export const authRouter = () => router
    .group(() => {
        router.post('sign-up', [AuthController, 'singUp'])
        router.post('forgot-password', [AuthController, 'forgotPassword'])
        router.post('reset-password', [AuthController, 'resetPassword'])
        router.post('refresh-token', [AuthController, 'refreshToken'])


        router.post('verify-user', [AuthController, 'verifyUser'])
        router.post('sign-in', [AuthController, 'signIn'])
    })
    .prefix('auth')


export const userRouter = () => router
    .group(() => {
        router.get('me', [AuthController, 'user'])

    }).prefix('user')