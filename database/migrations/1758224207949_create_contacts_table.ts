import {BaseSchema} from "@adonisjs/lucid/schema";

export default class Customers extends BaseSchema {
  protected tableName = 'contacts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary() // Primary key
      table.string('key', 255).notNullable().unique() // Email, unique
      table.string('value', 180).notNullable() // Password
      table.string('href').defaultTo(false) // Is verified
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
