import {
  type User,
  UserNotFound,
  UserAlreadyExist,
  UserRepository,
  type Label,
  type LabelModel,
  type Template,
  type TemplateModel
} from '@/domain/user'
import { conn } from '../connect'
import type mongoose from 'mongoose'
import { UserModel } from './model'
import type EventEmitter2 from 'eventemitter2'
import { Logger } from '@/infraestructure/logger'
import { type RepositoryQueryConfig } from '@/domain/core'
import { LabelMongoModel } from './label'
import { TemplateMongoModel } from './template'

export class MongoUserRepository extends UserRepository {
  private mongoose: typeof mongoose | null = null
  private readonly users = UserModel
  private readonly labels = LabelMongoModel
  private readonly templates = TemplateMongoModel
  constructor({ ...props }: { appContext?: string; eventEmitter: EventEmitter2 }) {
    super({
      ...props,
      logger: new Logger({ context: MongoUserRepository.name, appContext: props.appContext })
    })
  }

  private async conn(): Promise<typeof mongoose> {
    if (this.mongoose != null) return this.mongoose
    this.mongoose = await conn()
    return this.mongoose
  }

  async getById(id: string): Promise<User> {
    try {
      await this.conn()
      const repoUser = await this.users.findById(id).populate('labels').populate('templates')
      if (repoUser == null) throw new UserNotFound(id)
      const user = this.mapper.toDomain(repoUser)
      return user
    } catch (error) {
      console.log('MONGO_USER getById', error)
      throw error
    }
  }

  async getByEmail(email: string): Promise<User> {
    try {
      await this.conn()
      const repoUser = await this.users.findOne({ email }).populate('labels').populate('templates')
      if (repoUser == null) throw new UserNotFound(email, 'email')
      const user = this.mapper.toDomain(repoUser)
      return user
    } catch (error) {
      console.log('MONGO_USER getByEmail', error)
      throw error
    }
  }

  async getAll(): Promise<User[]> {
    try {
      await this.conn()
      const repoUsers = await this.users.find().populate('labels').populate('templates')
      const users = repoUsers.map((u) => this.mapper.toDomain(u))
      return users
    } catch (error) {
      console.log('MONGO_USER getAll', error)
      throw error
    }
  }

  async getLabelsByUserId(userId: string, config: { raw: true }): Promise<LabelModel[]>
  async getLabelsByUserId(userId: string, config?: RepositoryQueryConfig): Promise<Label[]>
  async getLabelsByUserId(
    userId: string,
    config?: RepositoryQueryConfig
  ): Promise<Label[] | LabelModel[]> {
    const user = await this.users.findById(userId).populate('labels').exec()
    if (user == null) throw new UserNotFound(userId)
    return config?.raw === true
      ? user.labels.map(({ createdAt, updatedAt, id, name }) => ({
          id,
          name,
          createdAt,
          updatedAt
        }))
      : user.labels.map(this.mapper.labelMapper.toDomain)
  }

  async getTemplatesByUserId(userId: string, config: { raw: true }): Promise<TemplateModel[]>
  async getTemplatesByUserId(userId: string, config?: RepositoryQueryConfig): Promise<Template[]>
  async getTemplatesByUserId(
    userId: string,
    config?: RepositoryQueryConfig
  ): Promise<TemplateModel[] | Template[]> {
    const user = await this.users.findById(userId).populate('templates').exec()
    if (user == null) throw new UserNotFound(userId)
    const templates = user.templates
    // FIXME: this is a workaround to avoid a bug in the mapper
    return config?.raw === true
      ? templates.map(({ id, name, tasks, createdAt, updatedAt }) => ({
          id,
          name,
          tasks: tasks.map(({ description, name, order, pomodoroEstimated, projectId }) => ({
            description,
            name,
            order,
            pomodoroEstimated,
            projectId
          })),
          createdAt,
          updatedAt
        }))
      : templates.map(this.mapper.templateMapper.toDomain)
  }

  /* ------ COMMANDS METHODS ------ */
  async create(user: User): Promise<User> {
    const exist = await this.users.findOne({ email: user.getProps().email })
    if (exist != null) throw new UserAlreadyExist(user.getProps().email, 'email')
    const newUser = this.mapper.toPersistence(user)
    await this.save(user, async () => {
      await this.conn()
      await this.users.create({ ...newUser, _id: newUser.id })
    })
    return user
  }

  async addTemplate(props: { user: User; template: Template }): Promise<Template> {
    this.logger.debug(`adding template with id: ${props.template.id}  to user : ${props.user.id}`)
    try {
      await this.save(props.user, async () => {
        await this.conn()
        const user = await this.users.findById(props.user.id)
        if (user == null) throw new UserNotFound(props.user.id)
        const newTemplate = await this.templates.create(
          this.mapper.templateMapper.toPersistence(props.template)
        )
        user.templates.push(newTemplate)
        await user.save()
      })
      return props.template
    } catch (error) {
      console.log('MONGO_USER addTemplate', error)
      throw error
    }
  }

  async updateTemplate(props: { user: User; template: Template }): Promise<Template> {
    this.logger.debug(`updating template with id: ${props.template.id}  to user : ${props.user.id}`)
    try {
      await this.save(props.user, async () => {
        await this.conn()
        const template = await this.templates.findOne({ id: props.template.id })
        // TODO: add a custom error
        if (template == null) throw new Error('Template not found')
        template.set(this.mapper.templateMapper.toPersistence(props.template))
        await template.save()
      })
      return props.template
    } catch (error) {
      console.log('MONGO_USER updateTemplate', error)
      throw error
    }
  }

  async removeTemplate(props: { user: User; templateId: string }): Promise<void> {
    this.logger.debug(`removing template with id: ${props.templateId}  to user : ${props.user.id}`)
    try {
      await this.save(props.user, async () => {
        await this.conn()
        await this.templates.findOneAndDelete({ id: props.templateId })
      })
    } catch (error) {
      console.log('MONGO_USER removeTemplate', error)
      throw error
    }
  }

  async addLabelToUser(props: { user: User; label: Label }): Promise<Label> {
    this.logger.debug(`adding label with id: ${props.label.id}  to user : ${props.user.id}`)
    try {
      await this.save(props.user, async () => {
        await this.conn()
        const user = await this.users.findById(props.user.id)
        if (user == null) throw new UserNotFound(props.user.id)
        const newLabel = await this.labels.create({
          ...this.mapper.labelMapper.toPersistence(props.label)
        })
        user.labels = [...user.labels, newLabel]
        await user.save()
      })
      return props.label
    } catch (error) {
      console.log('MONGO_USER addLabelToUser', error)
      throw error
    }
  }

  async removeLabel(props: { user: User; labelId: string }): Promise<void> {
    this.logger.debug(`removing label with id: ${props.labelId}  to user : ${props.user.id}`)
    try {
      await this.save(props.user, async () => {
        await this.conn()
        await this.labels.findOneAndDelete({ id: props.labelId })
      })
    } catch (error) {
      console.log('MONGO_USER removeLabel', error)
      throw error
    }
  }
}
