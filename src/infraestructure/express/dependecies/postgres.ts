import {
  PostgresTaskRepository,
  PostgresUserRepository
} from '@/infraestructure/repsitory/postgres'
import { type ApiExpress } from '../api'
import { ApiBuilderExpress } from './api-builder'

export const createPostgresApi = async (): Promise<ApiExpress> => {
  const apiBuilder = new ApiBuilderExpress()
  const userRepository = new PostgresUserRepository()
  const tastRepository = new PostgresTaskRepository()
  apiBuilder.setTaskRepository(tastRepository)
  apiBuilder.setUserRepository(userRepository)
  return apiBuilder.build()
}
