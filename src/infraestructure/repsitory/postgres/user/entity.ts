import { type IPrivateUser } from '@/domain/user'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class UserEntity implements IPrivateUser {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string

  @Column()
  lastname!: string

  @Column()
  username!: string

  @Column()
  email!: string

  @Column()
  password!: string
}
