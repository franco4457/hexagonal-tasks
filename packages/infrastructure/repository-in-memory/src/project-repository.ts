import { type EventBus } from '@domain/core'
import {
  type ProjectModel,
  ProjectRepository,
  type Project,
  ProjectNotFound
} from '@domain/project'
import { Logger } from '@infrastructure/logger'

export class InMemoryProjectRepository extends ProjectRepository {
  private readonly projects: ProjectModel[] = []
  constructor({ appContext, eventBus }: { appContext?: string; eventBus: EventBus }) {
    super({
      logger: new Logger({ appContext, context: InMemoryProjectRepository.name }),
      eventBus
    })
  }

  private exists({
    value,
    key = 'id'
  }: {
    value: string
    key?: keyof ProjectModel
  }): number | false {
    const idx = this.projects.findIndex((project) => project[key] === value)
    return idx === -1 ? false : idx
  }

  private projectfinder({ value, key }: { value: string; key?: keyof ProjectModel }): {
    idx: number
    project: ProjectModel
  } {
    const idx = this.exists({ value, key })

    if (idx === false) throw new ProjectNotFound(value, key as keyof Project)
    return {
      idx,
      project: this.projects[idx]
    }
  }

  async getById(projectId: string): Promise<Project> {
    const { project } = this.projectfinder({ value: projectId })
    return this.mapper.toDomain(project)
  }

  async getByUserId(userId: string): Promise<Project[]> {
    return this.projects.filter((project) => project.userId === userId).map(this.mapper.toDomain)
  }

  async getByNameAndUserId(query: { name: string; userId: string }): Promise<Project> {
    const idx = this.projects.findIndex(
      (project) => project.name === query.name && project.userId === query.userId
    )
    if (idx === -1) {
      throw new ProjectNotFound(query.name, 'name')
    }
    return this.mapper.toDomain(this.projects[idx])
  }

  async create(project: Project): Promise<void> {
    this.logger.debug(`creating entity to "project" table: ${project.id}`)
    await this.save(project, async () => {
      this.projects.push(this.mapper.toPersistence(project))
    })
  }

  async delete(projectId: string): Promise<void> {
    this.logger.debug(`deleting entity to "project" table: ${projectId}`)
    const { idx } = this.projectfinder({ value: projectId })
    this.projects.splice(idx, 1)
  }

  async sumPomodoroCount(projectId: string): Promise<void> {
    const { idx, project } = this.projectfinder({ value: projectId })
    await this.save(this.mapper.toDomain(project), async () => {
      project.pomodoroCount += 1
      this.projects[idx] = project
    })
  }
}
