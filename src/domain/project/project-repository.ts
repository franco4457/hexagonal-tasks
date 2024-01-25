import type EventEmitter2 from 'eventemitter2'
import { type LoggerPort, RepositoryBase } from '@/domain/core'
import { type ProjectModel, type Project } from './project.entity'
import { ProjectMapper } from './project.mapper'

export interface IProjectRepository {
  create: (project: Project) => Promise<void>
  delete: (id: Project['id']) => Promise<void>
  getById: (id: Project['id']) => Promise<Project>
  getByUserId: (userId: string) => Promise<Project[]>
  sumPomodoroCount: (id: Project['id']) => Promise<void>
}

export abstract class ProjectRepository
  extends RepositoryBase<Project, ProjectModel>
  implements IProjectRepository
{
  readonly repositoryName = 'ProjectRepository'
  constructor(props: { logger: LoggerPort; eventEmitter: EventEmitter2 }) {
    super({ ...props, mapper: new ProjectMapper() })
  }
  abstract create(project: Project): Promise<void>
  abstract delete(id: Project['id']): Promise<void>
  abstract getById(id: Project['id']): Promise<Project>
  abstract getByUserId(userId: string): Promise<Project[]>

  abstract sumPomodoroCount(id: Project['id']): Promise<void>
}
