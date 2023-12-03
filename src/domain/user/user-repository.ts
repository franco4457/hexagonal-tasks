import type { IUserCreate, IUser } from './user.entity'

export interface IUserRepository {
  getById: (id: IUser['id']) => Promise<IUser>
  getByEmail: (email: IUser['email']) => Promise<IUser>
  findAndValidate: (email: IUser['email'], password: string) => Promise<IUser>
  getAll: () => Promise<IUser[]>
  create: (user: IUserCreate) => Promise<IUser>
}
