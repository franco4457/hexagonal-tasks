import { Password, type TaskTemplate } from './value-objects'
import { randomUUID } from 'node:crypto'
import { AggregateRoot, ValidationError, isEmpty } from '@domain/core'
import { UserCreateEvent } from './events/user-create.event'
import { UserFieldIsRequired, UserPropNotFound } from './user.exceptions'
import {
  type LabelProps,
  Template,
  type TemplateProps,
  Label,
  type LabelModel,
  type TemplateModel
} from './entities'

import {
  UserAddLabelEvent,
  UserAddTemplateEvent,
  UserRemoveLabelEvent,
  UserRemoveTemplateEvent,
  UserUpdateTemplateEvent
} from './events'

export interface UserProps {
  name: string
  lastname: string
  username: string
  email: string
  labels: Label[]
  templates: Template[]
  password: Password
}
export type UserModel = Omit<UserProps, 'password' | 'labels' | 'templates'> & {
  id: string
  password: string
  labels: LabelModel[]
  templates: TemplateModel[]
  createdAt: Date
  updatedAt: Date
}

export type UserPropsLoginInput = Pick<UserProps, 'email' | 'username'> & {
  password: string
}

export type UserPropsCreate = Omit<UserProps, 'labels' | 'templates'>

export class User extends AggregateRoot<UserProps> {
  static create(props: UserPropsCreate): User {
    const id = randomUUID()
    const user = new User({
      props: { ...props, labels: [], templates: [] },
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

  get templates(): Template[] {
    return this.props.templates
  }

  get labels(): Label[] {
    return this.props.labels
  }

  updateTemplate(props: {
    templateId: string
    newProps: {
      name: string
      tasks: TaskTemplate[]
    }
  }): Template {
    const tempIdx = this.props.templates.findIndex((template) => template.id === props.templateId)
    if (tempIdx === -1) {
      throw new UserPropNotFound<'templates'>(props.templateId, 'templates[number].id')
    }
    const oldTemp = this.props.templates[tempIdx]
    const newTemplate = new Template({
      ...oldTemp.getProps(),
      props: props.newProps
    })
    this.props.templates[tempIdx] = newTemplate
    this.addEvent(
      new UserUpdateTemplateEvent({
        aggregateId: this.id,
        templateId: newTemplate.id,
        name: newTemplate.getProps().name
      })
    )
    return newTemplate
  }

  addTemplate(props: TemplateProps): Template {
    const template = Template.create(props)
    this.addEvent(
      new UserAddTemplateEvent({
        aggregateId: this.id,
        name: this.props.name,
        templateId: template.id
      })
    )
    this.props.templates.push(template)
    return template
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

  addLabel(props: LabelProps): Label {
    const label = Label.create(props)
    this.props.labels.push(label)
    this.addEvent(
      new UserAddLabelEvent({
        aggregateId: this.id,
        labelId: label.id,
        labelName: label.getProps().name
      })
    )
    return label
  }

  removeLabel(labelId: string): void {
    const idx = this.props.labels.findIndex((label) => label.id === labelId)
    if (idx === -1) return
    const label = this.props.labels[idx]
    this.props.labels.splice(idx, 1)
    this.addEvent(
      new UserRemoveLabelEvent({
        aggregateId: this.id,
        labelName: label.getProps().name,
        labelId: label.id
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
