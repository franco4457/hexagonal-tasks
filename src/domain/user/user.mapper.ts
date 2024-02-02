import { UserResponseDto } from './user.dto'
import { type Mapper } from '../core/mapper'
import { type UserModel, User } from './user.entity'
import { Password } from './value-objects'
import { LabelMapper, TemplateMapper } from './entities'

export class UserMapper implements Mapper<User, UserModel, UserResponseDto> {
  private readonly templateMapper = new TemplateMapper()
  private readonly labelMapper = new LabelMapper()
  toDomain(record: UserModel): User {
    const labels = record.labels.map(this.labelMapper.toDomain)
    const templates = record.templates.map(this.templateMapper.toDomain)
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
      labels: copy.labels.map(this.labelMapper.toPersistence),
      templates: copy.templates.map(this.templateMapper.toPersistence),
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
