import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { UserEntity } from './user/entity'
import { TaskEntity } from './task/entity'

// TODO: move this
const DB_URL = process.env.DB_URL ?? ''
if (DB_URL === '') throw new Error('DB_URL not found in .env file')

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  synchronize: true,
  entities: [UserEntity, TaskEntity],
  logging: false
})
