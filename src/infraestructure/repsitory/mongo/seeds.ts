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
        id: 'asd',
        _id: 'asd',
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
