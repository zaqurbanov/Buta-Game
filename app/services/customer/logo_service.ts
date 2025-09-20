import BaseValidatorService from "#contracts/services/base_validator_service"
import { Filters, FilterType } from "#contracts/types/filter_types"
import Logo from "#models/logo"
import BaseRepository from "#repositories/base_repository"
import LogoResource from "#resources/logo_resource"
import { getPaginationData } from "#services/utils/helpers"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"


@inject()
export default class LogoService {
    repository: BaseRepository<typeof Logo> = new BaseRepository(Logo)
    resource: LogoResource = new LogoResource()
    filters: Filters = {
        like: [
            { name: 'url', paramName: 'url', type: FilterType.STRING },
            { name: 'name', paramName: 'name', type: FilterType.STRING },
        ],
    }
    constructor(protected validator: BaseValidatorService) { }

   
    async list({ request }: HttpContext) {
        return this.repository.tryPaginate(
            this.repository.filter(this.repository.query(), this.filters, request),
            getPaginationData(request.qs()),
            this.resource
        )
    }


}