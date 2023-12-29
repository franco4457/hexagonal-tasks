import { Password } from './value-objects/password'
import { randomUUID } from 'node:crypto'
import { AggregateRoot } from '../core'

export interface UserProps {
  name: string
  lastname: string
  username: string
  email: string
  password: Password
}
export type UserModel = Omit<UserProps, 'password'> & {
  id: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export type UserPropsLoginInput = Pick<UserProps, 'email' | 'username'> & {
  password: string
}

export type UserPropsCreate = Pick<UserProps, 'name' | 'lastname'> & UserPropsLoginInput

export class User extends AggregateRoot<UserProps> {
  static async create(props: UserPropsCreate): Promise<User> {
    const id = randomUUID()
    const password = await Password.create(props.password)
    const user = new User({
      props: {
        ...props,
        password
      },
      id
    })
    return user
  }
}
