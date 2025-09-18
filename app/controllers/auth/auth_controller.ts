import type {HttpContext} from '@adonisjs/core/http'
import {inject} from '@adonisjs/core'
import InternalAuthService from '#services/user/auth_service'
import UserService from '#services/user/customer_service'
import Inspector from "#models/customer";

@inject()
export default class AuthController {
    constructor(
        protected authService: InternalAuthService,
        protected userService: UserService
    ) {
    }

    async singUp(ctx: HttpContext) {
        return this.authService.signUp(ctx)
    }

    async signIn(ctx: HttpContext) {
        return this.authService.signIn(ctx)
    }

    async verifyUser(ctx: HttpContext) {
        return this.authService.verifyUser(ctx)
    }

    async refreshToken(ctx: HttpContext) {
        return this.authService.refreshToken(ctx)
    }

    async user({userId}: HttpContext) {
        const inspector: Inspector | null = (await this.userService.getUserOrFail('id', userId as number))

        return {
            user: {
                email: inspector?.email,
                userId: inspector?.id,
            },
        }
    }

    async forgotPassword(ctx: HttpContext) {
        return this.authService.forgotPassword(ctx)
    }

    async resetPassword(ctx: HttpContext) {
        return this.authService.resetPassword(ctx)
    }
}
