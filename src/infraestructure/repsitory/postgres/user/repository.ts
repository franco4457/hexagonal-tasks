import { type IUserCreate, User, UserRepository } from '@/domain/user'
import { PostgresDataSource } from '..'
import { UserEntity } from './entity'

export class PostgresUserRepository extends UserRepository {
  private readonly userRepo
  constructor() {
    super()
    this.userRepo = PostgresDataSource.getRepository(UserEntity)
  }

  getById = async (id: string): Promise<User> => {
    const user = await this.userRepo.findOne({ where: { id } })
    if (user == null) throw new Error(`User with id: ${id} not found`)
    return new User(user)
  }

  getByEmail = async (email: string): Promise<User> => {
    const user = await this.userRepo.findOne({ where: { email } })
    if (user == null) throw new Error(`User with email: ${email} not found`)
    return new User(user)
  }

  findAndValidate = async (email: string, password: string): Promise<User> => {
    const user = await this.userRepo.findOne({ where: { email } })
    if (user == null) throw new Error(`User with email: ${email} not found`)
    if (user.password !== password) throw new Error('Invalid password')
    return new User(user)
  }

  getAll = async (): Promise<User[]> => {
    const users = await this.userRepo.find()
    return users.map((user) => new User(user))
  }

  create = async ({ password, ...user }: IUserCreate): Promise<User> => {
    const newUser = User.create({ password, ...user })
    const userEntity = new UserEntity()
    Object.assign(userEntity, { password, ...newUser })
    await this.userRepo.save(userEntity)
    return newUser
  }
}
