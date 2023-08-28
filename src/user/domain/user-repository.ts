import { type IUser, type IUserCreate } from './user.entity'

export interface IUserRepository {
  getById: (id: IUser['id']) => Promise<IUser>
  getByEmail: (email: IUser['email']) => Promise<IUser>
  getAll: () => Promise<IUser[]>
  create: (user: IUserCreate) => Promise<IUser>
}
