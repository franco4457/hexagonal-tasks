import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'
import {
  MongoTaskRepository,
  MongoUserRepository,
  testMongoSeeds
} from '@/infraestructure/repsitory/mongo'
import { NODE_ENV } from '@/config'

export const createMongoApi = async (): Promise<ApiExpress> => {
  if (NODE_ENV === 'test') await testMongoSeeds()
  const apiBuilder = new ApiBuilderExpress()
  const userRepository = new MongoUserRepository()
  const taskRepository = new MongoTaskRepository({ aggregates: { userRepo: userRepository } })
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
