import { Password } from './value-objects'
import { randomUUID } from 'node:crypto'
import { AggregateRoot, ValidationError, isEmpty } from '../core'
import { UserCreateEvent } from './events/user-create.event'
import { UserFieldIsRequired } from './user.exceptions'
import { Template, type TemplateProps } from './entities'
import { UserAddTemplateEvent, UserRemoveTemplateEvent } from './events'

export interface UserProps {
  name: string
  lastname: string
  username: string
  email: string
  templates: Template[]
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

  addTemplate(props: TemplateProps): void {
    const template = Template.create(props)
    this.addEvent(
      new UserAddTemplateEvent({
        aggregateId: this.id,
        name: this.props.name,
        templateId: template.id
      })
    )
    this.props.templates.push(template)
  }

  removeTemplate(templateId: string): void {
    const idx = this.props.templates.findIndex((template) => template.id === templateId)
    if (idx === -1) return
    const template = this.props.templates[idx]
    this.props.templates.splice(idx, 1)
    this.addEvent(
      new UserRemoveTemplateEvent({
        aggregateId: this.id,
        templateName: template.getProps().name,
        templateId: template.id
      })
    )
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
    if (!Array.isArray(this.props.templates)) {
      throw new ValidationError('user.templates should be an array')
    }
  }
}
