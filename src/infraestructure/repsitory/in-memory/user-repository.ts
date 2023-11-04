import {
  type IUser,
  type IUserCreate,
  type IUserRepository,
  UserEntity,
  type IUserPublic
} from '@/domain/user'
import { UserNotFound } from '@/domain/user/user.exceptions'

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: IUser[] = [
    {
      id: 'asd',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: '1234',
      username: 'tested'
    }
  ]

  async getByEmail(email: string): Promise<IUserPublic> {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound('User not found', 404)
    const { password: _, ...userPublic } = user
    return userPublic
  }

  async getAll(): Promise<IUserPublic[]> {
    return this.users.map(({ password: _, ...user }) => ({ ...user }))
  }

  async create(user: IUserCreate): Promise<IUserPublic> {
    const { password, ...newUser } = UserEntity.create(user)
    this.users.push({ password, ...newUser })
    return newUser
  }

  async getById(id: string): Promise<IUserPublic> {
    const user = this.users.find((user) => user.id === id)
    if (user == null) throw new UserNotFound('User not found', 404)
    return user
  }
}
