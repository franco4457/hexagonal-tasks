import { randomUUID } from 'node:crypto'
import { type AggregateID, Entity } from '../core'

export interface UserProps {
  name: string
  lastname: string
  username: string
  email: string
  password: string
}
export type UserModel = UserProps & {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type UserPropsLoginInput = Pick<UserProps, 'email' | 'username' | 'password'>

export type UserPropsCreate = Pick<UserProps, 'name' | 'lastname'> & UserPropsLoginInput

export class User extends Entity<UserProps> {
  protected readonly _id!: AggregateID
  static create(props: UserPropsCreate): User {
    const id = randomUUID()
    const user = new User({ props, id })
    return user
  }
}
