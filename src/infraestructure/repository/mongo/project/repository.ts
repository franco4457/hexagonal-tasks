import { type Project, ProjectNotFound, ProjectRepository } from '@/domain/project'
import { ProjectMongoModel } from './model'
import { Logger } from '@/infraestructure/logger'
import type EventEmitter2 from 'eventemitter2'
import type mongoose from 'mongoose'
import { conn } from '../connect'

export class MongoProjectRepository extends ProjectRepository {
  private mongoose: typeof mongoose | null = null
  private readonly projectModel = ProjectMongoModel
  constructor({ appContext, eventEmitter }: { appContext?: string; eventEmitter: EventEmitter2 }) {
    super({
      logger: new Logger({ appContext, context: MongoProjectRepository.name }),
      eventEmitter
    })
  }

  private async conn(): Promise<typeof mongoose> {
    if (this.mongoose != null) return this.mongoose
    this.mongoose = await conn()
    return this.mongoose
  }

  async getById(projectId: string): Promise<Project> {
    await this.conn()
    const project = await this.projectModel.findById(projectId)
    if (project == null) throw new ProjectNotFound(projectId, 'id')
    return this.mapper.toDomain(project)
  }

  async getByUserId(userId: string): Promise<Project[]> {
    await this.conn()
    const projects = await this.projectModel.find({ userId })
    return projects.map(this.mapper.toDomain)
  }

  async getByNameAndUserId(query: { name: string; userId: string }): Promise<Project> {
    await this.conn()
    const project = await this.projectModel.findOne(query)
    if (project == null) throw new ProjectNotFound(query.name, 'name')
    return this.mapper.toDomain(project)
  }

  async create(project: Project): Promise<void> {
    this.logger.debug(`creating entity to "project" table: ${project.id}`)
    await this.save(project, async () => {
      await this.conn()
      await this.projectModel.create(this.mapper.toPersistence(project))
    })
  }

  async delete(id: string): Promise<void> {
    this.logger.debug(`deleting entity from "project" table: ${id}`)
    const project = await this.projectModel.findById(id)
    if (project == null) throw new ProjectNotFound(id, 'id')
    await this.save(this.mapper.toDomain(project), async () => {
      await this.conn()
      await this.projectModel.deleteOne({ id })
    })
  }

  async sumPomodoroCount(id: string): Promise<void> {
    this.logger.debug(`updating entity from "project" table: ${id}`)
    const project = await this.projectModel.findOne({ id })
    if (project == null) throw new ProjectNotFound(id, 'id')
    await this.save(this.mapper.toDomain(project), async () => {
      await this.conn()
      project.pomodoroCount += 1
      await project.save()
    })
  }
}
