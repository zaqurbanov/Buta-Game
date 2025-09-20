import HeroSectionService from '#services/admin/hero_section_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'



@inject()
export default class HeroSectionController {
        
    constructor(protected service: HeroSectionService) {}
    async list(ctx: HttpContext) {

            return this.service.list(ctx)
        }
        async create(ctx: HttpContext) {
            return this.service.create(ctx)
        }

        async remove(ctx: HttpContext) {
            return this.service.remove(ctx)
        }

        async detail(ctx: HttpContext) {
            return this.service.detail(ctx)
        }
   
        
}