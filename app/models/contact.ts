import { column } from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'

export default class Contact extends EntityModel {
  static table = 'contacts'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare key: string

  @column()
  declare href: string

  @column()
  declare value: string
}
