import { column } from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'

export default class Permission extends EntityModel {
  static table = 'permissions'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare title: string

  @column({ columnName: 'permission_type' })
  declare permissionType: string

  @column({ columnName: 'group_title' })
  declare groupTitle: string
}
