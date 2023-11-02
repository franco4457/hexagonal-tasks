import {
  type IUser,
  type IUserCreate,
  type IUserRepository,
  UserEntity,
  type IUserPublic
} from '@/domain/user'
import { UserNotFound } from '@/domain/user/user.exceptions'

const inMemoryUsers: IUser[] = [
  {
    id: 'asd',
    email: 'example@mail.com',
    lastname: 'tester',
    name: 'test',
    password: '1234',
    username: 'tested'
  }
]

export class InMemoryUserRepository implements IUserRepository {
  async getByEmail(email: string): Promise<IUserPublic> {
    const user = inMemoryUsers.find((user) => user.email === email)
    if (user == null) throw new UserNotFound('User not found', 404)
    const { password: _, ...userPublic } = user
    return userPublic
  }

  async getAll(): Promise<IUserPublic[]> {
    return inMemoryUsers.map(({ password: _, ...user }) => ({ ...user }))
  }

  async create(user: IUserCreate): Promise<IUserPublic> {
    const { password, ...newUser } = UserEntity.create(user)
    inMemoryUsers.push({ password, ...newUser })
    return newUser
  }

  async getById(id: string): Promise<IUserPublic> {
    const user = inMemoryUsers.find((user) => user.id === id)
    if (user == null) throw new UserNotFound('User not found', 404)
    return user
  }
}
