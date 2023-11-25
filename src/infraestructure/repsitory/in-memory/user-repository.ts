import { type IUserCreate, type IUserRepository, User, type IPrivateUser } from '@/domain/user'
import { UserNotFound } from '@/domain/user/user.exceptions'

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: IPrivateUser[] = [
    {
      id: 'asd',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: '1234',
      username: 'tested'
    }
  ]

  async getByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound('User not found', 404)

    return new User(user)
  }

  async getAll(): Promise<User[]> {
    return this.users.map((user) => new User(user))
  }

  async create(user: IUserCreate): Promise<User> {
    const newUser = User.create(user)
    this.users.push({ ...newUser, password: user.password })
    return newUser
  }

  async getById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id)
    if (user == null) throw new UserNotFound('User not found', 404)
    return user
  }
}
