import { conn } from './connect'
import { TaskModel } from './task/model'
import { UserModel } from './user/model'

export const testMongoSeeds = async (): Promise<void> => {
  try {
    await conn()
    await UserModel.deleteMany({})
    await TaskModel.deleteMany({
      title: 'title'
    })
    await Promise.all([
      UserModel.create({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        _id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        email: 'example@mail.com',
        lastname: 'tester',
        name: 'test',
        password: '1234',
        username: 'tested'
      })
    ])
    console.log('Seeds created')
  } catch (error) {
    console.log('MONGO_SEEDS', error)
  }
}
