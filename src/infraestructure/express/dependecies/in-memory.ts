import {
  InMemoryProjectRepository,
  InMemoryTaskRepository,
  InMemoryTimerRepository,
  InMemoryUserRepository
} from '@/infraestructure/repository/in-memory'
import { ApiBuilderExpress } from './api-builder'
import type { ApiExpress } from '../api'

export const createInMemoryApi = (): ApiExpress => {
  const apiBuilder = new ApiBuilderExpress()
  const config = apiBuilder.getRepoConfig()
  const userRepository = new InMemoryUserRepository(config)
  const taskRepository = new InMemoryTaskRepository(config)
  const projectRepository = new InMemoryProjectRepository(config)
  const timerRepository = new InMemoryTimerRepository(config)
  apiBuilder.setTaskRepository(taskRepository)
  apiBuilder.setUserRepository(userRepository)
  apiBuilder.setProjectRepository(projectRepository)
  apiBuilder.setTimerRepository(timerRepository)
  return apiBuilder.build()
}
