import { UserResponseDto } from './user.dto'
import { type Mapper } from '../core/mapper'
import { type UserModel, User } from './user.entity'
import { Password } from './value-objects'

export class UserMapper implements Mapper<User, UserModel, UserResponseDto> {
  toDomain(record: UserModel): User {
    const user = new User({
      id: record.id,
      props: {
        name: record.name,
        lastname: record.lastname,
        username: record.username,
        email: record.email,
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
