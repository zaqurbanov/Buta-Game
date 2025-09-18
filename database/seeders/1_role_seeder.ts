import { inject } from '@adonisjs/fold'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#models/role'
import { baseRole } from '#contracts/constants/auth'
import env from "#start/env";

@inject()
export default class extends BaseSeeder {
  async run() {
    const existingRole = await Role.query().where('name', env.get('BASE_ROLE')).first()

    if (!existingRole) {
      await Role.create(baseRole as any)
    }
  }
}
