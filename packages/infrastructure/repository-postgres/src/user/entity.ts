import { type UserModel } from '@domain/user'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class UserEntity implements UserModel {
  @PrimaryColumn('uuid', { unique: true, nullable: false })
  id!: string

  @Column('varchar', { nullable: false, length: 50 })
  name!: string

  @Column('varchar', { nullable: false, length: 50 })
  lastname!: string

  @Column('varchar', { nullable: false, length: 50 })
  username!: string

  @Column('varchar', { unique: true, nullable: false, length: 50 })
  email!: string

  @Column('varchar', { nullable: false, length: 50 })
  password!: string
}
