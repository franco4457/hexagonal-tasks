import { UserResponseDto } from './user.dto'
import { type Mapper } from '../core/mapper'
import { type UserModel, User } from './user.entity'
import { Password, TaskTemplate } from './value-objects'
import { Label, Template } from './entities'

// TODO: subEntities Mapper
export class UserMapper implements Mapper<User, UserModel, UserResponseDto> {
  toDomain(record: UserModel): User {
    const labels = record.labels.map(({ id, createdAt, updatedAt, ...props }) => {
      return new Label({ id, createdAt, updatedAt, props })
    })
    const templates = record.templates.map(({ id, createdAt, updatedAt, ...props }) => {
      const tasks = props.tasks.map((task) => {
        return new TaskTemplate(task)
      })
      return new Template({ id, createdAt, updatedAt, props: { name: props.name, tasks } })
    })
    const user = new User({
      id: record.id,
      props: {
        name: record.name,
        lastname: record.lastname,
        username: record.username,
        email: record.email,
        labels,
        templates,
        password: new Password(record.password)
      },
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt)
    })
    return user
  }

  toPersistence(entity: User): UserModel {
    const copy = entity.getProps()
    const record: UserModel = {
      id: entity.id,
      email: copy.email,
      name: copy.name,
      lastname: copy.lastname,
      username: copy.username,
      labels: copy.labels.map((label) => {
        const { id, createdAt, updatedAt, ...props } = label.getProps()
        return { id, createdAt, updatedAt, ...props }
      }),
      templates: copy.templates.map((template) => {
        const { id, createdAt, updatedAt, ...props } = template.getProps()
        return {
          id,
          createdAt,
          updatedAt,
          name: props.name,
          tasks: props.tasks.map((task) => {
            return task.value
          })
        }
      }),
      password: copy.password.value,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt
    }
    return record
  }

  toResponse(entity: User): UserResponseDto {
    const { id, createdAt, updatedAt, ...props } = entity.getProps()
    const response = new UserResponseDto({ id, createdAt, updatedAt })
    response.name = props.name
    response.lastname = props.lastname
    response.username = props.username
    response.email = props.email
    return response
  }
}
