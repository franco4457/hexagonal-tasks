import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'
import {
  MongoTaskRepository,
  MongoUserRepository,
  testMongoSeeds,
  MongoProjectRepository,
  MongoTimerRepository
} from '@infrastructure/repository-mongo'
import { NODE_ENV } from '../config'

export const createMongoApi = async (): Promise<ApiExpress> => {
  if (NODE_ENV === 'test') await testMongoSeeds()
  const apiBuilder = new ApiBuilderExpress()
  const config = apiBuilder.getRepoConfig()
  const userRepository = new MongoUserRepository(config)
  const taskRepository = new MongoTaskRepository(config)
  const projectRepository = new MongoProjectRepository(config)
  const timerRepository = new MongoTimerRepository(config)
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  apiBuilder.setProjectRepository(projectRepository)
  apiBuilder.setTimerRepository(timerRepository)
  return apiBuilder.build()
}
