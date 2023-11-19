import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'
import {
  MongoTaskRepository,
  MongoUserRepository,
  testMongoSeeds
} from '@/infraestructure/repsitory/mongo'
import { NODE_ENV } from '@/config'

export const createMongoApi = (): ApiExpress => {
  if (NODE_ENV === 'test') void testMongoSeeds()
  const apiBuilder = new ApiBuilderExpress()
  const taskRepository = new MongoTaskRepository()
  const userRepository = new MongoUserRepository()
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
