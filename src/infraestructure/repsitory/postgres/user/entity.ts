import { type IPrivateUser } from '@/domain/user'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class UserEntity implements IPrivateUser {
  @PrimaryColumn('uuid')
  id!: string

  @Column('varchar', { nullable: false, length: 50 })
  name!: string

  @Column('varchar', { nullable: false, length: 50 })
  lastname!: string

  @Column('varchar', { nullable: false, length: 50 })
  username!: string

  @Column('varchar', { nullable: false, length: 50 })
  email!: string

  @Column('varchar', { nullable: false, length: 50 })
  password!: string
}
