import ContactService from '#services/customer/contact_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ContactController {
  constructor(protected service: ContactService) {}

  async list() {
    return this.service.list()
  }

 
}
