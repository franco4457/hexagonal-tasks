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
      labels: [],
      templates: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  constructor({
    users,
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
    if (users != null) this.users = users
  }

  private userFinder({ value, key = 'id' }: { value: string; key?: keyof UserModel }): {
    user: UserModel
    userIndex: number
  } {
    const idx = this.users.findIndex((user) => user[key] === value)
    if (idx === -1) throw new UserNotFound(value, key)
    return {
      user: this.users[idx],
      userIndex: idx
    }
  }

  async getByEmail(email: string): Promise<User> {
    const { user } = this.userFinder({ value: email, key: 'email' })
    return this.mapper.toDomain(user)
  }

  async getAll(): Promise<User[]> {
    return this.users.map((user) => this.mapper.toDomain(user))
  }

  async create(user: User): Promise<User> {
    this.logger.debug('creating 1 entities to "user" table:', user.id)
    if (this.users.some((u) => u.email === user.getProps().email)) {
      throw new UserAlreadyExist(user.getProps().email, 'email')
    }
    await this.save(user, async () => {
      this.users.push(this.mapper.toPersistence(user))
    }).catch((err) => {
      this.logger.error(err)
    })
    return user
  }

  async getById(id: string): Promise<User> {
    const { user } = this.userFinder({ value: id })
    return this.mapper.toDomain(user)
  }

  // FIXME: implement the rest of the methods
}
