import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { createLogResponse} from '#services/utils/helpers'

/**
 * Updating the "Accept" header to always accept "application/json" response
 * from the server. This will force the internals of the framework like
 * validator errors or auth errors to return a JSON response.
 */
export default class ForceJsonResponseMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const { request } = ctx

    const headers = request.headers()
    headers.accept = 'application/json'
    await next()
    createLogResponse(ctx)
  }
}
