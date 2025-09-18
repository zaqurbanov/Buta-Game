import {BaseSchema} from "@adonisjs/lucid/schema";

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary() // Primary key
      table.string('email', 255).notNullable().unique() // Email, unique
      table.string('password', 180).notNullable() // Password
      table.boolean('is_verified').defaultTo(false) // Is verified
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
