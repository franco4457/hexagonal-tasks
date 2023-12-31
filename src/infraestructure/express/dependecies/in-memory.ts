import {
  InMemoryTaskRepository,
  InMemoryUserRepository
} from '@/infraestructure/repository/in-memory'
import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'

export const createInMemoryApi = (): ApiExpress => {
  const apiBuilder = new ApiBuilderExpress()
  const config = apiBuilder.getRepoConfig()
  const userRepository = new InMemoryUserRepository(config)
  const taskRepository = new InMemoryTaskRepository({ aggregates: { userRepo: userRepository } })
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
