import { column } from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'

export default class Hero_section extends EntityModel {
  static table = 'hero_sections'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare url: string

  @column()
  declare publicId: string

  @column()
  declare name: string

}
