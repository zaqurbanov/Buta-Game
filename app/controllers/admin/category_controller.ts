import CategoryService from '#services/admin/category_service'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

@inject()
export default class CategoryController {
  constructor(protected service: CategoryService) {}

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
