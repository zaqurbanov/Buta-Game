import { inject } from '@adonisjs/fold'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import app from '@adonisjs/core/services/app'
import UserService from '#services/user/user_crud_service'
import RoleService from '#services/user/role_service'
import { baseRole, baseUser } from '#contracts/constants/auth'

@inject()
export default class extends BaseSeeder {
  async run() {
    const userService = await app.container.make(UserService)
    const roleService = await app.container.make(RoleService)

    const existingAdmin = await userService.checkAdmin(baseUser.email, baseRole.name)
    if (!existingAdmin) {
      const role = await roleService.findByName(baseRole.name)
      if (role) {
        await userService.createBasic({ ...baseUser, roles: [role.id] })
      } else {
        console.log('Admin role not found.')
      }
    } else {
      console.log('Admin user already exists.')
    }
  }
}
