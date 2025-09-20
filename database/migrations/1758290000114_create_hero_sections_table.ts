import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'hero_sections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('public_id').notNullable()
      table.string('url').notNullable()
      table.string('name').notNullable()

       table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}