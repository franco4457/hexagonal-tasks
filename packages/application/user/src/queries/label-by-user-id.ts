import { type IQueryHandler, QueryBase } from '@domain/core'
import { type LabelModel, type UserRepository } from '@domain/user'

export class LabelByUserIdQuery extends QueryBase {
  readonly userId: string
  constructor(props: { userId: string }) {
    super()
    this.userId = props.userId
  }
}

export class LabelByUserIdHandler implements IQueryHandler<LabelByUserIdQuery, LabelModel[]> {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(query: LabelByUserIdQuery): Promise<LabelModel[]> {
    const { userId } = query
    return await this.userRepository.getLabelsByUserId(userId, { raw: true })
  }
}
