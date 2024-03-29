import { type LoggerPort, RepositoryBase, type EventBus } from '@domain/core'
import { type ProjectModel, type Project } from './project.entity'
import { ProjectMapper } from './project.mapper'

export interface IProjectRepository {
  create: (project: Project) => Promise<void>
  delete: (id: Project['id']) => Promise<void>
  getById: (id: Project['id']) => Promise<Project>
  getByUserId: (userId: string) => Promise<Project[]>
  getByNameAndUserId: (query: { name: string; userId: string }) => Promise<Project>
  sumPomodoroCount: (id: Project['id']) => Promise<void>
}

export abstract class ProjectRepository
  extends RepositoryBase<Project, ProjectModel>
  implements IProjectRepository
{
  readonly repositoryName = 'ProjectRepository'
  constructor(props: { logger: LoggerPort; eventBus: EventBus }) {
    super({ ...props, mapper: new ProjectMapper() })
  }
  abstract create(project: Project): Promise<void>
  abstract delete(id: Project['id']): Promise<void>
  abstract getById(id: Project['id']): Promise<Project>
  abstract getByUserId(userId: string): Promise<Project[]>
  abstract getByNameAndUserId(query: { name: string; userId: string }): Promise<Project>

  abstract sumPomodoroCount(id: Project['id']): Promise<void>
}
