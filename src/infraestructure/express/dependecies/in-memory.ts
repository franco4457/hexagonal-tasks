import {
  InMemoryTaskRepository,
  InMemoryUserRepository
} from '@/infraestructure/repsitory/in-memory'
import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'

export const createInMemoryApi = (): ApiExpress => {
  const apiBuilder = new ApiBuilderExpress()
  const taskRepository = new InMemoryTaskRepository()
  const userRepository = new InMemoryUserRepository()
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
