import { UserResponseDto } from './user.dto'
import { type Mapper } from '../core/mapper'
import { type UserModel, User } from './user.entity'
import { Password } from './value-objects'

export class UserMapper implements Mapper<User, UserModel, UserResponseDto> {
  toDomain(record: UserModel): User {
    const { id, createdAt, updatedAt, ...props } = record
    const user = new User({
      props: {
        ...props,
        password: new Password(props.password)
      },
      id,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    })
    return user
  }

  toPersistence(entity: User): UserModel {
    const { id, createdAt, updatedAt, ...props } = entity.getProps()
    const { password } = props
    const record: UserModel = {
      ...props,
      password: password.value,
      id,
      createdAt,
      updatedAt
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
