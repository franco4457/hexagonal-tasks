import { conn } from './connect'
import { UserModel } from './user/model'

export const testMongoSeeds = async (): Promise<void> => {
  try {
    void conn().then(() => {
      void Promise.all([
        UserModel.create({
          id: 'asd',
          email: 'example@mail.com',
          lastname: 'tester',
          name: 'test',
          password: '1234',
          username: 'tested'
        })
      ]).then(() => {
        console.log('Seeds created')
      })
    })
  } catch (error) {
    console.log('MONGO_SEEDS', error)
  }
}
