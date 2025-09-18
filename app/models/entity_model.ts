import {BaseModel, column} from "@adonisjs/lucid/orm";
import {DateTime} from "luxon";

export default class EntityModel extends BaseModel {
  @column.dateTime({autoCreate: true})
  declare createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  declare updatedAt: DateTime

  @column()
  declare active:boolean


}
