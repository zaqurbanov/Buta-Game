import {column, hasManyThrough, manyToMany} from '@adonisjs/lucid/orm'
import EntityModel from '#models/entity_model'
import IHasPermission from '#contracts/permission/i_has_permission'
import Role from '#models/role'
import type {HasManyThrough, ManyToMany} from '@adonisjs/lucid/types/relations'
import UserRole from '#models/user_role'

export default class User extends EntityModel implements IHasPermission {
    static table = 'users'
    @column({isPrimary: true})
    declare id: number

    @column()
    declare email: string

    @column()
    declare password: string

    @hasManyThrough([() => Role, () => UserRole], {
        localKey: 'id',
        throughLocalKey: 'roleId',
        foreignKey: 'userId',
        throughForeignKey: 'id',
    })
    declare roles: HasManyThrough<typeof Role>

    @manyToMany(() => Role, {
        pivotTable: 'user_roles',
        localKey: 'id',
        relatedKey: 'id',
        pivotForeignKey: 'user_id',
        pivotRelatedForeignKey: 'role_id',
    })
    declare syncRoles: ManyToMany<typeof Role>

    @column({columnName: 'is_verified'})
    declare isVerified: boolean

    permissions(): string[] {
        return this.roles
            .map((r) => {
                return r.permissions.map((p) => p.name)
            })
            .flat()
    }

}
