import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable();
      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.timestamp('deleted_at').after('updated_at')
      table.boolean("active").defaultTo(false).notNullable().after('deleted_at');
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
