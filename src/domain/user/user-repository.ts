import type EventEmitter2 from 'eventemitter2'
import { type LoggerPort, RepositoryBase } from '../core'
import type { User, UserModel } from './user.entity'
import { UserMapper } from './user.mapper'

export interface IUserRepository {
  getById: (id: string) => Promise<User>
  getByEmail: (email: string) => Promise<User>
  findAndValidate: (email: string, password: string) => Promise<User>
  getAll: () => Promise<User[]>
  create: (user: User) => Promise<User>
}

export abstract class UserRepository
  extends RepositoryBase<User, UserModel>
  implements IUserRepository
{
  readonly repositoryName = 'UserRepository'
  constructor(props: { logger: LoggerPort; eventEmitter: EventEmitter2 }) {
    super({ ...props, mapper: new UserMapper() })
  }

  protected readonly mapper = new UserMapper()
  abstract getById(id: string): Promise<User>
  abstract getByEmail(email: string): Promise<User>
  abstract findAndValidate(email: string, password: string): Promise<User>
  abstract getAll(): Promise<User[]>
  abstract create(user: User): Promise<User>
}
