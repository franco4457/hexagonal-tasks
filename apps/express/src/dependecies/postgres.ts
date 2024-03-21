// import {
//   postgresTestSeeds,
//   PostgresDataSource
//   // PostgresTaskRepository,
//   // PostgresUserRepository
// } from '@infrastructure/repository-postgres'
import { type ApiExpress } from '../api'
// import { ApiBuilderExpress } from './api-builder'
// import { NODE_ENV } from '#/config'

export const createPostgresApi = async (): Promise<ApiExpress> => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {} as ApiExpress
  // try {
  //   await PostgresDataSource.initialize()
  //   if (NODE_ENV === 'test') await postgresTestSeeds()
  //   const apiBuilder = new ApiBuilderExpress()
  //   // const userRepository = new PostgresUserRepository()
  //   // const taskRepository = new PostgresTaskRepository({
  //   //   aggregates: { userRepo: userRepository }
  //   // })
  //   // apiBuilder.setTaskRepository(taskRepository)
  //   // apiBuilder.setUserRepository(userRepository)
  //   return apiBuilder.build()
  // } catch (error) {
  //   console.log('POSTGRES INITIALIZE_ERROR', error)
  //   throw error
  // }
}
