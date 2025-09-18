import {inject} from '@adonisjs/core'
import BaseRepository from '#repositories/base_repository'
import BaseValidatorService from '#contracts/services/base_validator_service'
import User from '#models/user'
import bcrypt from "bcrypt";
import BadException from "#exceptions/bad_exception";
import {SignUpPayload} from "#contracts/types/payload/auth_payloads";
import Customer from "#models/customer";

@inject()
export default class UserCrudService {
    repository: BaseRepository<typeof User> = new BaseRepository(User)

    constructor(
        protected validator: BaseValidatorService,
    ) {
    }

    async checkAdmin(email: string, roleName: string) {
        return this.repository
            .query()
            .where('email', email)
            .preload('roles', (subQ) => {
                subQ.where('name', roleName)
            })
            .first()
    }

    async createBasic(payload: any) {
        const hashed = await this.hashPassword(payload.password || '')

        const data = await this.repository.create({
            email: payload.email,
            password: hashed,
            active: true,
        })

        await data.related('syncRoles').attach(payload.roles)
        return data
    }


    private hashPassword(password: string) {
        return bcrypt.hash(password, 10)
    }

    async login(email: string, password: string): Promise<User> {
        const user = await this.getUserOrFail('email', email)
        const isValid = await this.verifyPassword(password, user.password)
        if (!isValid) throw new BadException('Invalid email or password')
        return user
    }

    private verifyPassword(plain: string, hashed: string) {
        return bcrypt.compare(plain, hashed)
    }

    async getUserOrFail(field: 'id' | 'email', value: number | string): Promise<User> {
        const user = await this.repository.query().where(field, value).andWhere('active', true).first()
        if (!user) throw new BadException('User not found')
        return user
    }

    async userExists(email: string) {
        return this.getUserOrFail('email', email)
    }

    async updateUser(id: number, data: Partial<SignUpPayload>): Promise<Customer> {
        const user = await this.getUserOrFail('id', id)
        if (data.password) data.password = await this.hashPassword(data.password)
        return this.repository.update({password: data.password, isVerified: true}, user)
    }
}
