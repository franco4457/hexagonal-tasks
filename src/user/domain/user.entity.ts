import { randomUUID } from 'node:crypto'

export interface IUser {
  id: string
  name: string
  lastname: string
  username: string
  email: string
  password: string
  //   token: string
  //   refreshToken: string
  //   createdAt: Date
  //   updatedAt: Date
}

// export type IUserPublic = Omit<
//   IUser,
//   'id' | 'password' | 'createdAt' | 'updatedAt'
// >

export type IUserLoginInput = Pick<IUser, 'email' | 'username' | 'password'>

export type IUserCreate = Pick<IUser, 'email' | 'username' | 'password' | 'name' | 'lastname'>

export class UserEntity implements IUser {
  id: string
  name: string
  lastname: string
  username: string
  email: string
  password: string

  constructor({ email, id, lastname, name, password, username }: IUser) {
    this.id = id
    this.email = email
    this.lastname = lastname
    this.name = name
    this.password = password
    this.username = username
  }

  static create(props: IUserCreate): IUser {
    const id = randomUUID()
    const user = new UserEntity({ ...props, id })
    return user
  }
}
