import type { UserPropsCreate, User } from './user.entity'

export interface IUserRepository {
  getById: (id: string) => Promise<User>
  getByEmail: (email: string) => Promise<User>
  findAndValidate: (email: string, password: string) => Promise<User>
  getAll: () => Promise<User[]>
  create: (user: UserPropsCreate) => Promise<User>
}

export abstract class UserRepository implements IUserRepository {
  readonly repositoryName = 'UserRepository'
  abstract getById(id: string): Promise<User>
  abstract getByEmail(email: string): Promise<User>
  abstract findAndValidate(email: string, password: string): Promise<User>
  abstract getAll(): Promise<User[]>
  abstract create(user: UserPropsCreate): Promise<User>
}
