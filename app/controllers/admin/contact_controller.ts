import ContactService from '#services/admin/contact_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class ContactController {
  constructor(protected service: ContactService) {}

  async list(ctx: HttpContext) {
    return this.service.list(ctx)
  }

  async remove(ctx: HttpContext) {
    return this.service.remove(ctx)
  }

  async detail(ctx: HttpContext) {
    return this.service.detail(ctx)
  }

  async update(ctx: HttpContext) {
    return this.service.update(ctx)
  }

  async create(ctx: HttpContext) {
    return this.service.create(ctx)
  }
}
