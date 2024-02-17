import { type IQueryHandler, QueryBase } from '@/domain/core'
import { type UserRepository, type TemplateModel } from '@/domain/user'

export class TemplateByUserIdQuery extends QueryBase {
  readonly userId: string
  constructor(props: { userId: string }) {
    super()
    this.userId = props.userId
  }
}

export class TemplateByUserIdQueryHandler
  implements IQueryHandler<TemplateByUserIdQuery, TemplateModel[]>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(query: TemplateByUserIdQuery): Promise<TemplateModel[]> {
    const { userId } = query
    return await this.userRepository.getTemplatesByUserId(userId, { raw: true })
  }
}
