/* eslint-disable  */
import { type IPrivateUser } from '@/domain/user'
import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class UserEntity implements IPrivateUser {
  @PrimaryColumn()
  id: string

  @Column()
  name: string
  @Column()
  lastname: string
  @Column()
  username: string
  @Column()
  email: string
  @Column()
  password: string
  constructor(user: IPrivateUser) {
    this.id = user.id
    this.name = user.name
    this.lastname = user.lastname
    this.username = user.username
    this.email = user.email
    this.password = user.password
  }
}
