import { UserRepository, type User, type UserModel } from '@/domain/user'
import { UserAlreadyExist, UserNotFound } from '@/domain/user/user.exceptions'
import { Logger } from '@/infraestructure/logger'
import type EventEmitter2 from 'eventemitter2'

export class InMemoryUserRepository extends UserRepository {
  private readonly users: UserModel[] = [
    {
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: '$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u',
      username: 'tested',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  constructor({
    users = [],
    ...props
  }: {
    users?: UserModel[]
    appContext?: string
    eventEmitter: EventEmitter2
  }) {
    super({
      ...props,
      logger: new Logger({ context: InMemoryUserRepository.name, appContext: props.appContext })
    })
    this.users = users
  }

  async getByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email)
    if (user == null) throw new UserNotFound(email, 'email')

    return this.mapper.toDomain(user)
  }

  async findAndValidate(email: string, password: string): Promise<User> {
    const record = this.users.find((user) => user.email === email)
    if (record == null) throw new UserNotFound(email, 'email')
    const user = this.mapper.toDomain(record)
    const isValidPass = await user.getProps().password.compare(password)
    if (!isValidPass) throw new UserNotFound(email, 'email')
    return user
  }

  async getAll(): Promise<User[]> {
    return this.users.map((user) => this.mapper.toDomain(user))
  }

  async create(user: User): Promise<User> {
    if (this.users.some((u) => u.email === user.getProps().email)) {
      throw new UserAlreadyExist(user.getProps().email, 'email')
    }
    this.users.push(this.mapper.toPersistence(user))
    return user
  }

  async getById(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id)
    if (user == null) throw new UserNotFound(id)
    return this.mapper.toDomain(user)
  }
}
