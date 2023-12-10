import type { IUserCreate, IUser, User } from './user.entity'

export interface IUserRepository {
  getById: (id: IUser['id']) => Promise<User>
  getByEmail: (email: IUser['email']) => Promise<User>
  findAndValidate: (email: IUser['email'], password: string) => Promise<User>
  getAll: () => Promise<User[]>
  create: (user: IUserCreate) => Promise<User>
}

export abstract class UserRepository implements IUserRepository {
  readonly repositoryName = 'UserRepository'
  abstract getById: (id: string) => Promise<User>
  abstract getByEmail: (email: string) => Promise<User>
  abstract findAndValidate: (email: string, password: string) => Promise<User>
  abstract getAll: () => Promise<User[]>
  abstract create: (user: IUserCreate) => Promise<User>
}
