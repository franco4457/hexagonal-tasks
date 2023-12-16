import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { UserEntity } from './user/entity'
import { TaskEntity } from './task/entity'

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'postgres',
  synchronize: true,
  entities: [UserEntity, TaskEntity],
  logging: false
})
