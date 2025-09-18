import { inject } from '@adonisjs/core'
import BaseRepository from '#repositories/base_repository'
import BaseValidatorService from '#contracts/services/base_validator_service'
import Contact from '#models/contact'
import ContactResource from '#resources/contact_resource'

@inject()
export default class ContactService {
  repository: BaseRepository<typeof Contact> = new BaseRepository(Contact)
  resource: ContactResource = new ContactResource()
  constructor(protected validator: BaseValidatorService) {}

  async list() {
    const records = await this.repository.query().limit(6)

    return this.resource.collection(records)
  }
}
