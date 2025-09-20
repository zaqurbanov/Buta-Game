import BaseValidatorService from "#contracts/services/base_validator_service"
import { Filters, FilterType } from "#contracts/types/filter_types"
import BadException from "#exceptions/bad_exception"
import Hero_section from "#models/hero_section"
import BaseRepository from "#repositories/base_repository"
import HeroSectionResource from "#resources/hero_section_resource"
import { getPaginationData } from "#services/utils/helpers"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"


@inject()
export default class HeroSectionService {
    repository: BaseRepository<typeof Hero_section> = new BaseRepository(Hero_section)
    resource: HeroSectionResource = new HeroSectionResource()
    filters: Filters = {
        like: [
            { name: 'url', paramName: 'url', type: FilterType.STRING },
            { name: 'name', paramName: 'name', type: FilterType.STRING },
        ],
    }
    constructor(protected validator: BaseValidatorService) { }
    async findByIdOrThrow(id: number) {
        const record = await this.repository.find('id', id)
        if (!record) {
            throw new BadException('Contact not found')
        }

        return record
    }
 
    async list({ request }: HttpContext) {
        return this.repository.tryPaginate(
            this.repository.filter(this.repository.query(), this.filters, request),
            getPaginationData(request.qs()),
            this.resource
        )
    }
    async detail({ request }: HttpContext) {
        const id = request.params().id
        const record = await this.findByIdOrThrow(id)

        return this.resource.single(record)
    }

  

}