import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { UserEntity } from './user/entity'
import { TaskEntity } from './task/entity'
import { DB_URL } from '@/config'

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  url: DB_URL,
  entities: [UserEntity, TaskEntity],
  logging: false
})
