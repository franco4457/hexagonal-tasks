import { UserEntity, type IUserCreate, type IUserPublic, type IUserRepository } from '@/domain/user'
import { conn } from '../connect'
import type mongoose from 'mongoose'
import { UserModel } from './model'

export class MongoUserRepository implements IUserRepository {
  private mongoose: typeof mongoose | null = null

  private readonly conn = async (): Promise<typeof mongoose> => {
    if (this.mongoose != null) return this.mongoose
    this.mongoose = await conn()
    return this.mongoose
  }

  getById = async (id: string): Promise<IUserPublic> => {
    try {
      await this.conn()
      const repoUser = await UserModel.findById(id)
      if (repoUser == null) throw new Error('User not found')
      const user = {
        id: repoUser.id,
        email: repoUser.email,
        name: repoUser.name,
        lastname: repoUser.lastname,
        username: repoUser.username
      } satisfies IUserPublic
      return user
    } catch (error) {
      console.log('MONGO_USER getById', error)
      throw new Error('Unable to get user')
    }
  }

  getByEmail = async (email: string): Promise<IUserPublic> => {
    try {
      await this.conn()
      const repoUser = await UserModel.findOne({ email })
      if (repoUser == null) throw new Error('User not found')
      const user = {
        id: repoUser.id,
        email: repoUser.email,
        name: repoUser.name,
        lastname: repoUser.lastname,
        username: repoUser.username
      } satisfies IUserPublic
      return user
    } catch (error) {
      console.log('MONGO_USER getByEmail', error)
      throw new Error('Unable to get user')
    }
  }

  getAll = async (): Promise<IUserPublic[]> => {
    try {
      await this.conn()
      const repoUsers = await UserModel.find()
      const users = repoUsers.map(
        (repoUser) =>
          ({
            id: repoUser.id,
            email: repoUser.email,
            name: repoUser.name,
            lastname: repoUser.lastname,
            username: repoUser.username
          } satisfies IUserPublic)
      )
      return users
    } catch (error) {
      console.log('MONGO_USER getAll', error)
      throw new Error('Unable to get users')
    }
  }

  create = async (user: IUserCreate): Promise<IUserPublic> => {
    try {
      const newUser = UserEntity.create(user)
      await this.conn()
      const repoUser = await UserModel.create(newUser)
      const userPublic = {
        id: repoUser.id,
        email: repoUser.email,
        name: repoUser.name,
        lastname: repoUser.lastname,
        username: repoUser.username
      } satisfies IUserPublic
      return userPublic
    } catch (error) {
      console.log('MONGO_USER create', error)
      throw new Error('Unable to create user')
    }
  }
}
