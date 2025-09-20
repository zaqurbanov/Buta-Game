import BaseValidatorService from "#contracts/services/base_validator_service"
import { Filters, FilterType } from "#contracts/types/filter_types"
import BadException from "#exceptions/bad_exception"
import Category from "#models/category"
import BaseRepository from "#repositories/base_repository"
import CategoryResource from "#resources/category_resource"
import { saveCategorySchema } from "#schemas/admin_schema"
import CloudinaryService from "#services/cloudinary_service"
import { getPaginationData } from "#services/utils/helpers"
import { inject } from "@adonisjs/core"
import { HttpContext } from "@adonisjs/core/http"


@inject()
export default class CategoryService {
    repository: BaseRepository<typeof Category> = new BaseRepository(Category)
    cloudinaryService: CloudinaryService = new CloudinaryService()
    resource: CategoryResource = new CategoryResource()
    filters: Filters = {
        like: [
            { name: 'title', paramName: 'title', type: FilterType.STRING },
            { name: 'imageUrl', paramName: 'imageUrl', type: FilterType.STRING },
            { name: 'imagePublicId', paramName: 'imagePublicId', type: FilterType.STRING },
            { name: 'parentId', paramName: 'parentId', type: FilterType.NUMBER },

        ],
    }
    constructor(protected validator: BaseValidatorService) { }
    async findByIdOrThrow(id: number) {
        const record = await this.repository.find('id', id)
        if (!record) {
            throw new BadException('Parent category not found')
        }

        return record
    }



    //  CREATE  

    async create({ request }: HttpContext) {
        const { image, title, parentId } = await request.validateUsing(saveCategorySchema)
        let uploadedImage
        if (image) {
            uploadedImage = await this.cloudinaryService.upload(image, 'category')

        }

        if(parentId){
             await this.findByIdOrThrow(Number(parentId) )
            
        }

        const record = await this.repository.create({
            title,
            imageUrl: image ? uploadedImage?.secure_url : null,
            imagePublicId: image ? uploadedImage?.public_id : null,
            parentId
        })


        return this.resource.single(record)
    }


    //  LIST

    async list({ request }: HttpContext) {
        return this.repository.tryPaginate(
            this.repository.filter(this.repository.query(), this.filters, request),
            getPaginationData(request.qs()),
            this.resource
        )
    }

    // DETAIL
    async detail({ request }: HttpContext) {
        const id = request.params().id
        const record = await this.findByIdOrThrow(id)

        return this.resource.single(record)
    }

    async update({ request }: HttpContext) {
        const id = request.params().id
        const record = await this.findByIdOrThrow(id)
        const { image, title, parentId } = await request.validateUsing(saveCategorySchema)
        let payload: { title: string; parentId: string | undefined; imageUrl?: string; imagePublicId?: string; } = {
            title,
            parentId,

        }
        if (image) {
            record.imagePublicId && await this.cloudinaryService.destroy(record?.imagePublicId)
            const uploadedImage = await this.cloudinaryService.upload(image, 'category')
            payload = { ...payload, imageUrl: uploadedImage.secure_url, imagePublicId: uploadedImage.public_id }
        }

        const updatedRecord = await this.repository.update(payload, record)

        return this.resource.single(updatedRecord)
    }

    async remove({ request }: HttpContext) {
        const id = request.params().id
        const record = await this.findByIdOrThrow(id)

        record.imagePublicId && await this.cloudinaryService.destroy(record?.imagePublicId)
        await record.delete()

        return this.resource.single(record)
    }

}