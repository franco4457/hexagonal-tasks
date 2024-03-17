import { type IQueryHandler, QueryBase } from '@domain/core'
import { type User, type UserRepository } from '@domain/user'

export class UserByUserIdQuery extends QueryBase {
  readonly id: string
  constructor(props: { id: string }) {
    super()
    this.id = props.id
  }
}

export class UserByUserIdQueryHandler implements IQueryHandler<UserByUserIdQuery, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: UserByUserIdQuery): Promise<User> {
    const { id } = query
    // TODO: return raw data to map only one time
    return await this.userRepository.getById(id)
  }
}
