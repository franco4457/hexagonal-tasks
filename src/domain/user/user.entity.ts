import { randomUUID } from 'node:crypto'

export interface IUser {
  id: string
  name: string
  lastname: string
  username: string
  email: string
}

export interface IPrivateUser extends IUser {
  password: string
}

export type IUserLoginInput = Pick<IPrivateUser, 'email' | 'username' | 'password'>

export type IUserCreate = Pick<IUser, 'name' | 'lastname'> & IUserLoginInput

export class User implements IUser {
  readonly id: string
  readonly name: string
  readonly lastname: string
  readonly username: string
  readonly email: string

  constructor({ email, id, lastname, name, username }: IUser) {
    this.id = id
    this.email = email
    this.lastname = lastname
    this.name = name
    this.username = username
  }

  static create(props: IUserCreate): IUser {
    const id = randomUUID()
    const user = new User({ ...props, id })
    return user
  }
}
