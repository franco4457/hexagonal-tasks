import { type IUser, type IUserCreate, type IUserRepository, UserEntity } from '@/domain/user'
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
  async getByEmail(email: string): Promise<IUser> {
    const user = inMemoryUsers.find((user) => user.email === email)
    if (user == null) throw new UserNotFound('User not found', 404)
    return user
  }

  async getAll(): Promise<IUser[]> {
    return inMemoryUsers
  }

  async create(user: IUserCreate): Promise<IUser> {
    const newUser = UserEntity.create(user)
    inMemoryUsers.push(newUser)
    return newUser
  }

  async getById(id: string): Promise<IUser> {
    const user = inMemoryUsers.find((user) => user.id === id)
    if (user == null) throw new UserNotFound('User not found', 404)
    return user
  }
}
