import { PostgresDataSource } from './data-source'
import { UserEntity } from './user'

export const postgresTestSeeds = async (): Promise<void> => {
  try {
    const userRepo = PostgresDataSource.getRepository(UserEntity)
    await userRepo.clear()
    const userEnt = new UserEntity()
    Object.assign(userEnt, {
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: 'Pass1234',
      username: 'tested'
    })
    await userRepo.save(userEnt)
    console.log('Seeds created')
  } catch (error) {
    console.log('POSTGRES_SEEDS', error)
  }
}
