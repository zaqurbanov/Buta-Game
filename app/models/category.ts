import { belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Category extends EntityModel {
  static table = 'categories'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string 

  @column()
  declare imageUrl: string | null

  @column()
  declare imagePublicId: string | null

  @column()
  declare parentId: number | null


  // parentleri tapmaq ucun 
  @belongsTo(() => Category, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Category>

  @hasMany(() => Category, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Category>
}

