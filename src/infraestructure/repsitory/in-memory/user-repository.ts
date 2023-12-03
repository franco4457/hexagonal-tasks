import { type IUserCreate, type IUserRepository, User, type IPrivateUser } from '@/domain/user'
import { UserAlreadyExist, UserNotFound } from '@/domain/user/user.exceptions'

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: IPrivateUser[] = [
    {
      id: 'asd',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: 'Pass1234',
      username: 'tested'
    }
  ]

  constructor(users?: IPrivateUser[]) {
    if (users != null) this.users = users
  }

  async getByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound(email, 'email')

    return new User(user)
  }

  async findAndValidate(email: string, password: string): Promise<User> {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound(email, 'email')
    if (user.password !== password) throw new UserNotFound(email, 'email')
    return new User(user)
  }

  async getAll(): Promise<User[]> {
    return this.users.map((user) => new User(user))
  }

  async create(user: IUserCreate): Promise<User> {
    if (this.users.some((u) => u.email === user.email)) {
      throw new UserAlreadyExist(user.email, 'email')
    }
    const newUser = User.create(user)
    this.users.push({ ...newUser, password: user.password })
    return newUser
  }

  async getById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id)
    if (user == null) throw new UserNotFound(id)
    return user
  }
}
