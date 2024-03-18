import { conn } from './connect'
import { ProjectMongoModel } from './project'
import { TaskMongoModel } from './task/model'
import { TimerMongoModel } from './timer'
import { LabelMongoModel } from './user/label'
import { UserModel } from './user/model'
import { TemplateMongoModel } from './user/template'

export const testMongoSeeds = async (): Promise<void> => {
  try {
    await conn()
    await UserModel.deleteMany({})
    await UserModel.deleteMany({
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a'
    })
    await TaskMongoModel.deleteMany({})
    await TimerMongoModel.deleteMany({})
    await LabelMongoModel.deleteMany({})
    await TemplateMongoModel.deleteMany({})
    await ProjectMongoModel.deleteMany({})
    await Promise.all([
      UserModel.create({
        id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        _id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
        email: 'example@mail.com',
        lastname: 'tester',
        name: 'test',
        password: '$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u',
        username: 'tested',
        labels: [],
        templates: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
    ])
    console.log('Seeds created')
  } catch (error) {
    console.log('MONGO_SEEDS', error)
  }
}
