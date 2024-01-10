import { Password } from './value-objects'
import { randomUUID } from 'node:crypto'
import { AggregateRoot, ValidationError, isEmpty } from '../core'
import { UserCreateEvent } from './events/user-create.event'
import { UserFieldIsRequired } from './user.exceptions'

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
  static create(props: UserProps): User {
    const id = randomUUID()
    const user = new User({
      props,
      id
    })

    user.addEvent(
      new UserCreateEvent({
        aggregateId: user.id,
        email: user.props.email,
        username: user.props.username
      })
    )

    return user
  }

  public validate(): void {
    const { name, lastname, username, email, password } = this.props
    if (isEmpty(name)) throw new UserFieldIsRequired('name')
    if (isEmpty(lastname)) throw new UserFieldIsRequired('lastname')
    if (isEmpty(username)) throw new UserFieldIsRequired('username')
    if (isEmpty(email)) throw new UserFieldIsRequired('email')
    if (!Password.isValueObject(password)) {
      throw new ValidationError('user.password should be a Password instance')
    }
  }
}
