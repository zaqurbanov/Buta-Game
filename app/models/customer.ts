import { column } from '@adonisjs/lucid/orm'
import EntityModel from "#models/entity_model";

export default class Customer extends EntityModel {
  static table = "customers";
  @column({isPrimary: true})
  declare id: number

  @column({columnName:'email'})
  declare email: string

  @column()
  declare password?: string

  @column({columnName:'is_verified'})
  declare isVerified: boolean

}
