import { type IUserCreate, UserRepository, User, type IPrivateUser } from '@/domain/user'
import { UserAlreadyExist, UserNotFound } from '@/domain/user/user.exceptions'

export class InMemoryUserRepository extends UserRepository {
  private readonly users: IPrivateUser[] = [
    {
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: 'Pass1234',
      username: 'tested'
    }
  ]

  constructor(users?: IPrivateUser[]) {
    super()
    if (users != null) this.users = users
  }

  getByEmail = async (email: string): Promise<User> => {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound(email, 'email')

    return new User(user)
  }

  findAndValidate = async (email: string, password: string): Promise<User> => {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound(email, 'email')
    if (user.password !== password) throw new UserNotFound(email, 'email')
    return new User(user)
  }

  getAll = async (): Promise<User[]> => {
    return this.users.map((user) => new User(user))
  }

  create = async (user: IUserCreate): Promise<User> => {
    if (this.users.some((u) => u.email === user.email)) {
      throw new UserAlreadyExist(user.email, 'email')
    }
    const newUser = User.create(user)
    this.users.push({ ...newUser, password: user.password })
    return newUser
  }

  getById = async (id: string): Promise<User> => {
    const user = this.users.find((user) => user.id === id)
    if (user == null) throw new UserNotFound(id)
    return user
  }
}
