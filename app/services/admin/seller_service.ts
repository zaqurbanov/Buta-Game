import BaseRepository from '#repositories/base_repository'
import {SignUpPayload} from '#contracts/types/payload/auth_payloads'
import bcrypt from 'bcrypt'
import BadException from '#exceptions/bad_exception'
import Seller from '#models/seller'

export default class SellerService {
    protected userRepository = new BaseRepository(Seller)

    private hashPassword(password: string) {
        return bcrypt.hash(password, 10)
    }

    private verifyPassword(plain: string, hashed: string) {
        return bcrypt.compare(plain, hashed)
    }

    async getUserOrFail(field: 'id' | 'email', value: number | string): Promise<Seller> {
        const user = await this.userRepository.find(field, value)
        if (!user) throw new BadException('User not found')
        return user
    }

    async getUser(field: 'id' | 'email', value: number | string) {
        const user = await this.userRepository.find(field, value)
        return user
    }

    async createUser({email, password}: SignUpPayload): Promise<Seller> {
        const hashed = await this.hashPassword(password || '')
        return this.userRepository.create({email, password: hashed})
    }

    async updateUser(id: number, data: Partial<SignUpPayload>): Promise<Seller> {
        const user = await this.getUserOrFail('id', id)
        if (data.password) data.password = await this.hashPassword(data.password)
        return this.userRepository.update(data, user)
    }

    async verifyUser(userId: number) {
        const user = await this.getUserOrFail('id', userId)
        return this.userRepository.update({isVerified: true}, user)
    }

    async userExists(email: string) {
        return this.getUserOrFail('email', email)
    }

    async login(email: string, password: string): Promise<Seller> {
        const user = await this.getUserOrFail('email', email)
        const isValid = await this.verifyPassword(password, user.password as string)
        if (!isValid) throw new BadException('Invalid email or password')
        return user
    }
}
