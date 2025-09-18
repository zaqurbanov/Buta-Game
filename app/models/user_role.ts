import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class UserRole extends BaseModel {
  static table = 'user_roles'
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'role_id' })
  declare roleId: number

  @column({ columnName: 'user_id' })
  declare userId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
