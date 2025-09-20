import { column } from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'

export default class Seller extends EntityModel {
    static table = 'sellers'
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare email: string

    @column()
    declare password: string

    @column({ columnName: 'is_verified' })
    declare isVerified: boolean

    @column({ columnName: 'is_active' })
    declare isActive: boolean

}
