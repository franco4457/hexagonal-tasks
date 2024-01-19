import { RepositoryBase } from '../core'
import { type ProjectModel, type Project } from './project.entity'

export interface IProjectRepository {
  create: (project: Project) => Promise<void>
  delete: (id: Project['id']) => Promise<void>
  getById: (id: Project['id']) => Promise<Project>
  getByUserId: (userId: string) => Promise<Project[]>
}

export abstract class ProjectRepository
  extends RepositoryBase<Project, ProjectModel>
  implements IProjectRepository
{
  abstract create(project: Project): Promise<void>
  abstract delete(id: Project['id']): Promise<void>
  abstract getById(id: Project['id']): Promise<Project>
  abstract getByUserId(userId: string): Promise<Project[]>
}
