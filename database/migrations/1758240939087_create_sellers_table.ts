import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sellers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
         table.increments('id')
            table.string('email').unique().notNullable();
            table.string('password').nullable();
            table.timestamp('created_at')
            table.timestamp('updated_at')
            table.boolean('is_verified').defaultTo(false) // Is verified
            table.boolean("active").defaultTo(true).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}