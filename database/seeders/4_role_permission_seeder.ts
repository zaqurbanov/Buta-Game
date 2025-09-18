import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import Permission from '#models/permission'
import { baseRole } from '#contracts/constants/auth'

export default class AssignPermissionsToAdminRoleSeeder extends BaseSeeder {
  async run() {
    const adminRole = await Role.findByOrFail('name', baseRole.name)
    const attachedPermissionIds = await adminRole.related('syncPermissions').query().select('id')
    const attachedIds = attachedPermissionIds.map((p) => p.id)

    const unattachedPermissions = await Permission.query().whereNotIn('id', attachedIds)

    if (unattachedPermissions.length > 0) {
      await adminRole.related('syncPermissions').attach(unattachedPermissions.map((p) => p.id))
    }
  }
}
