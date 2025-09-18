import { inject } from '@adonisjs/core'
import BaseRepository from '#repositories/base_repository'
import BaseValidatorService from '#contracts/services/base_validator_service'
import Role from '#models/role'

@inject()
export default class RoleService {
  repository: BaseRepository<typeof Role> = new BaseRepository(Role)

  constructor(protected validator: BaseValidatorService) {}


  async findByName(name: string) {
    return this.repository.query().where('name', name).first()
  }
}
