import type { IUser, IUserCreate, IUserPublic } from './user.entity'

export interface IUserRepository {
  getById: (id: IUser['id']) => Promise<IUserPublic>
  getByEmail: (email: IUser['email']) => Promise<IUserPublic>
  getAll: () => Promise<IUserPublic[]>
  create: (user: IUserCreate) => Promise<IUserPublic>
}
