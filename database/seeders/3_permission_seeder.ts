import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#models/permission'
import Role from '#models/role'
import { RawPermissionItem } from '#contracts/types/auth_types'
import { PERMISSION as RAW_PERMISSIONS } from '#contracts/constants/permission'
import { baseRole } from '#contracts/constants/auth'

export default class extends BaseSeeder {
  async run() {
    const permissions = this.transformPermissions(RAW_PERMISSIONS)

    const createdAny = await this.syncPermissions(permissions)

    if (createdAny) {
      await this.assignPermissionsToAdminRole(permissions)
    }
  }

  transformPermissions(items: RawPermissionItem[]) {
    return items.flatMap((item) =>
      item.permissionTypes.map((type) => ({
        name: `${item.name}_${type}`,
        title: item.title,
        groupTitle: item.groupTitle,
        permissionType: type,
      }))
    )
  }

  async syncPermissions(permissions: any[]) {
    let createdAny = false

    for (const permission of permissions) {
      const exists = await Permission.query()
        .where('name', permission.name)
        .first()

      if (!exists) {
        await Permission.create(permission)
        createdAny = true
      }
    }

    return createdAny
  }

  async assignPermissionsToAdminRole(permissions: any[]) {
    const adminRole = await Role.findByOrFail('name', baseRole.name)

    const permissionRecords = await Permission.query().whereIn(
      'name',
      permissions.map((p) => p.name)
    )

    await adminRole.related('syncPermissions').attach(permissionRecords.map((p) => p.id))
  }
}
