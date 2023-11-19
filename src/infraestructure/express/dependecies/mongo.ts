import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'
import { MongoTaskRepository, MongoUserRepository } from '@/infraestructure/repsitory/mongo'

export const createMongoApi = (): ApiExpress => {
  const apiBuilder = new ApiBuilderExpress()
  const taskRepository = new MongoTaskRepository()
  const userRepository = new MongoUserRepository()
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
