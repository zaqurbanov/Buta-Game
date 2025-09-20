import BaseValidatorService from "#contracts/services/base_validator_service"
import { Filters, FilterType } from "#contracts/types/filter_types"
import Logo from "#models/logo"
import BaseRepository from "#repositories/base_repository"
import LogoResource from "#resources/logo_resource"
import { saveLogoSchema } from "#schemas/admin_schema"
import CloudinaryService from "#services/cloudinary_service"
import { getPaginationData } from "#services/utils/helpers"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"


@inject()
export default class LogoService {
    repository: BaseRepository<typeof Logo> = new BaseRepository(Logo)
    cloudinaryService: CloudinaryService = new CloudinaryService()
    resource: LogoResource = new LogoResource()
    filters: Filters = {
        like: [
            { name: 'url', paramName: 'url', type: FilterType.STRING },
            { name: 'name', paramName: 'name', type: FilterType.STRING },
        ],
    }
    constructor(protected validator: BaseValidatorService) { }

    async create({ request }: HttpContext) {
        const { image } = await request.validateUsing(saveLogoSchema)

        const uploadedImage = await this.cloudinaryService.upload(image, 'logos')

        const oldLogo = await this.repository.query().first()
        if (oldLogo) {
            
            await this.cloudinaryService.destroy(oldLogo.publicId)
            await this.repository.query().where('id', oldLogo.id).delete()

        }
        const record = await this.repository.create({ url: uploadedImage.secure_url, name: image.clientName, publicId: uploadedImage.public_id })

        return this.resource.single(record)
    }
    async list({ request }: HttpContext) {
        return this.repository.tryPaginate(
            this.repository.filter(this.repository.query(), this.filters, request),
            getPaginationData(request.qs()),
            this.resource
        )
    }


}