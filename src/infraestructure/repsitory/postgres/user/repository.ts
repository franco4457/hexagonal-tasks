import {
  type IUserCreate,
  User,
  UserRepository,
  UserNotFound,
  UserAlreadyExist
} from '@/domain/user'
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
    if (user == null) throw new UserNotFound(id)
    return new User(user)
  }

  getByEmail = async (email: string): Promise<User> => {
    const user = await this.userRepo.findOne({ where: { email } })
    if (user == null) throw new UserNotFound(email, 'email')
    return new User(user)
  }

  findAndValidate = async (email: string, password: string): Promise<User> => {
    try {
      const user = await this.userRepo.findOne({
        where: { email }
      })
      if (user == null) throw new UserNotFound(email, 'email')
      if (user.password !== password) throw new UserNotFound(email, 'email')
      return new User(user)
    } catch (error) {
      console.log('POSTGRES findAndValidate', error)
      throw error
    }
  }

  getAll = async (): Promise<User[]> => {
    const users = await this.userRepo.find()
    return users.map((user) => new User(user))
  }

  create = async ({ password, ...user }: IUserCreate): Promise<User> => {
    try {
      const exist = await this.userRepo.findOne({
        where: { email: user.email }
      })
      if (exist != null) throw new UserAlreadyExist(user.email)
      const newUser = User.create({ password, ...user })
      const userEntity = new UserEntity()
      Object.assign(userEntity, { password, ...newUser })
      await this.userRepo.save(userEntity)
      return newUser
    } catch (error) {
      console.log('POSTGRES create', error)
      throw error
    }
  }
}
