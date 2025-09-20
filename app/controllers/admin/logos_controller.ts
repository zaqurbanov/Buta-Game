import LogoService from '#services/admin/logo_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'



@inject()
export default class LogosController {
        
    constructor(protected service: LogoService) {}
    async list(ctx: HttpContext) {

            return this.service.list(ctx)
        }
        async create(ctx: HttpContext) {
            return this.service.create(ctx)
        }

   
        
}