import {
  User,
  type IUserCreate,
  UserNotFound,
  UserAlreadyExist,
  UserRepository
} from '@/domain/user'
import { conn } from '../connect'
import type mongoose from 'mongoose'
import { UserModel } from './model'

export class MongoUserRepository extends UserRepository {
  private mongoose: typeof mongoose | null = null

  private readonly conn = async (): Promise<typeof mongoose> => {
    if (this.mongoose != null) return this.mongoose
    this.mongoose = await conn()
    return this.mongoose
  }

  getById = async (id: string): Promise<User> => {
    try {
      await this.conn()
      const repoUser = await UserModel.findById(id)
      if (repoUser == null) throw new UserNotFound(id)
      const user = new User({
        id: repoUser.id,
        email: repoUser.email,
        name: repoUser.name,
        lastname: repoUser.lastname,
        username: repoUser.username
      })
      return user
    } catch (error) {
      console.log('MONGO_USER getById', error)
      throw error
    }
  }

  getByEmail = async (email: string): Promise<User> => {
    try {
      await this.conn()
      const repoUser = await UserModel.findOne({ email })
      if (repoUser == null) throw new UserNotFound(email, 'email')
      const user = new User({
        id: repoUser.id,
        email: repoUser.email,
        name: repoUser.name,
        lastname: repoUser.lastname,
        username: repoUser.username
      })
      return user
    } catch (error) {
      console.log('MONGO_USER getByEmail', error)
      throw new Error('Unable to get user')
    }
  }

  getAll = async (): Promise<User[]> => {
    try {
      await this.conn()
      const repoUsers = await UserModel.find()
      const users = repoUsers.map(
        (repoUser) =>
          new User({
            id: repoUser.id,
            email: repoUser.email,
            name: repoUser.name,
            lastname: repoUser.lastname,
            username: repoUser.username
          })
      )
      return users
    } catch (error) {
      console.log('MONGO_USER getAll', error)
      throw new Error('Unable to get users')
    }
  }

  create = async (user: IUserCreate): Promise<User> => {
    try {
      const exist = await UserModel.findOne({ email: user.email })
      if (exist != null) throw new UserAlreadyExist(user.email, 'email')
      const newUser = User.create(user)
      await this.conn()
      const repoUser = await UserModel.create({ ...newUser, _id: newUser.id })
      const userPublic = new User({
        id: repoUser.id,
        email: repoUser.email,
        name: repoUser.name,
        lastname: repoUser.lastname,
        username: repoUser.username
      })
      return userPublic
    } catch (error) {
      console.log('MONGO_USER create', error)
      throw error
    }
  }

  findAndValidate = async (email: string, password: string): Promise<User> => {
    const repoUser = await UserModel.findOne({ email, password })
    if (repoUser == null) throw new UserNotFound(email, 'email')
    const user = new User({
      id: repoUser.id,
      email: repoUser.email,
      name: repoUser.name,
      lastname: repoUser.lastname,
      username: repoUser.username
    })
    return user
  }
}
