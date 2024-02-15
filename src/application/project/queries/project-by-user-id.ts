import { type Project, type ProjectRepository } from '@/domain/project'
import { type IQueryHandler, QueryBase } from '@/domain/core'

export class ProjectByUserIdQuery extends QueryBase {
  readonly userId: string
  constructor(props: { userId: string }) {
    super()
    this.userId = props.userId
  }
}

export class ProjectByUserIdQueryHandler implements IQueryHandler<ProjectByUserIdQuery, Project[]> {
  constructor(private readonly projectRepository: ProjectRepository) {}
  async execute(query: ProjectByUserIdQuery): Promise<Project[]> {
    return await this.projectRepository.getByUserId(query.userId)
  }
}
