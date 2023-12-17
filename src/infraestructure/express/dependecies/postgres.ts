import {
  postgresTestSeeds,
  PostgresDataSource,
  PostgresTaskRepository,
  PostgresUserRepository
} from '@/infraestructure/repsitory/postgres'
import { type ApiExpress } from '../api'
import { ApiBuilderExpress } from './api-builder'
import { NODE_ENV } from '@/config'

export const createPostgresApi = async (): Promise<ApiExpress> => {
  try {
    await PostgresDataSource.initialize()
    if (NODE_ENV === 'test') await postgresTestSeeds()
    const apiBuilder = new ApiBuilderExpress()
    const userRepository = new PostgresUserRepository()
    const taskRepository = new PostgresTaskRepository({
      aggregates: { userRepo: userRepository }
    })
    apiBuilder.setTaskRepository(taskRepository)
    apiBuilder.setUserRepository(userRepository)
    return apiBuilder.build()
  } catch (error) {
    console.log('POSTGRES INITIALIZE_ERROR', error)
    throw error
  }
}
