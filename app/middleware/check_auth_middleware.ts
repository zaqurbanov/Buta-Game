import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AuthorizationErrorException from '#exceptions/authorization_error_exception'
import { inject } from '@adonisjs/core'
import BaseAuthService from '#contracts/services/base_auth_service'
import UserService from '#services/user/customer_service'

@inject()
export default class CheckAuthMiddleware {
  constructor(
    protected authService: BaseAuthService,
    protected userService: UserService,
  ) {}

  async handle(ctx: HttpContext, next: NextFn) {
    const accessToken = ctx.request.header('Authorization')
    if (!accessToken) {
      return this.reject()
    }
    const userData: any = await this.authService.checkToken(accessToken)
    const user = await this.userService.userExists(userData.email)
    ctx.userId = user?.id

    await next()
  }

  reject() {
    throw new AuthorizationErrorException('Access token not found')
  }
}
