import { column, hasManyThrough, manyToMany } from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'
import type { HasManyThrough, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from '#models/permission'
import RolePermission from '#models/role_permission'

export default class Role extends EntityModel {
  static table = 'roles'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasManyThrough([() => Permission, () => RolePermission], {
    localKey: 'id',
    throughLocalKey: 'permissionId',
    foreignKey: 'roleId',
    throughForeignKey: 'id',
  })
  declare permissions: HasManyThrough<typeof Permission>

  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'permission_id',
  })
  declare syncPermissions: ManyToMany<typeof Permission>
}
