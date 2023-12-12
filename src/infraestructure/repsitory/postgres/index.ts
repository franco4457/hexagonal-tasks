import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { UserEntity } from './user/entity'

export const PostgresDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'postgres',
  synchronize: true,
  entities: [UserEntity],
  logging: false
})
