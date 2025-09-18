import { inject } from '@adonisjs/core'
import BaseRepository from '#repositories/base_repository'
import BaseValidatorService from '#contracts/services/base_validator_service'
import BadException from '#exceptions/bad_exception'
import Contact from '#models/contact'
import { HttpContext } from '@adonisjs/core/http'
import { ContactPayload } from '#contracts/types/payload/admin.type'
import { saveContactSchema } from '#schemas/admin_schema'
import ContactResource from '#resources/contact_resource'
import { Filters, FilterType } from '#contracts/types/filter_types'
import { getPaginationData } from '#services/utils/helpers'

@inject()
export default class ContactService {
  repository: BaseRepository<typeof Contact> = new BaseRepository(Contact)
  resource: ContactResource = new ContactResource()
  filters: Filters = {
    like: [
      { name: 'key', paramName: 'key', type: FilterType.STRING },
      { name: 'value', paramName: 'value', type: FilterType.STRING },
      { name: 'href', paramName: 'href', type: FilterType.STRING },
    ],
  }
  constructor(protected validator: BaseValidatorService) {}

  async create({ request }: HttpContext) {
    const payload = await this.validate(request.body())

    const record = await this.repository.create(payload)

    return this.resource.single(record)
  }

  async findByIdOrThrow(id: number) {
    const record = await this.repository.find('id', id)
    if (!record) {
      throw new BadException('Contact not found')
    }

    return record
  }

  async update({ request }: HttpContext) {
    const id = request.params().id
    const record = await this.findByIdOrThrow(id)
    const payload = await this.validate(request.body(),id)

    const updatedRecord = await this.repository.update(payload, record)

    return this.resource.single(updatedRecord)
  }

  async detail({ request }: HttpContext) {
    const id = request.params().id
    const record = await this.findByIdOrThrow(id)

    return this.resource.single(record)
  }

    async list({ request }: HttpContext) {
    return this.repository.tryPaginate(
      this.repository.filter(this.repository.query(), this.filters, request),
      getPaginationData(request.qs()),
      this.resource
    )
  }


  async remove({ request }: HttpContext) {
    const id = request.params().id
    const record = await this.findByIdOrThrow(id)

    await record.delete()

    return this.resource.single(record)
  }

  async validate(data: Record<string, any>, ignoreId?: string): Promise<ContactPayload> {
    await this.validator.validate(saveContactSchema(ignoreId), data)

    return data as ContactPayload
  }
}
