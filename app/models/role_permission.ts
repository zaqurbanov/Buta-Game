import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RolePermission extends BaseModel {
  static table = 'role_permissions'
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'role_id' })
  declare roleId: number

  @column({ columnName: 'permission_id' })
  declare permissionId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
