import {
  type LoggerPort,
  type RepositoryQueryConfig,
  type EventBus,
  RepositoryBase
} from '@domain/core'
import type { User, UserModel } from './user.entity'
import { UserMapper } from './user.mapper'
import { type TemplateModel, type Label, type Template, type LabelModel } from './entities'

export interface IUserRepository {
  getById: (id: string, config?: RepositoryQueryConfig) => Promise<User>
  getByEmail: (email: string, config?: RepositoryQueryConfig) => Promise<User>
  getAll: (config?: RepositoryQueryConfig) => Promise<User[]>

  /** ---- MUTATIONS ---- */
  create: (user: User) => Promise<User>

  getTemplatesByUserId: (
    userId: string,
    config?: RepositoryQueryConfig
  ) => Promise<Template[] | TemplateModel[]>
  addTemplate: (props: { user: User; template: Template }) => Promise<Template>
  updateTemplate: (props: { user: User; template: Template }) => Promise<Template>
  removeTemplate: (props: { user: User; templateId: Template['id'] }) => Promise<void>

  getLabelsByUserId: (
    userId: string,
    config?: RepositoryQueryConfig
  ) => Promise<Label[] | LabelModel[]>
  addLabelToUser: (props: { user: User; label: Label }) => Promise<Label>
  removeLabel: (props: { user: User; labelId: Label['id'] }) => Promise<void>
}

export abstract class UserRepository
  extends RepositoryBase<User, UserModel>
  implements IUserRepository
{
  readonly repositoryName = 'UserRepository'
  constructor(props: { logger: LoggerPort; eventBus: EventBus }) {
    super({ ...props, mapper: new UserMapper() })
  }

  protected readonly mapper = new UserMapper()
  abstract getById(id: string, config?: RepositoryQueryConfig): Promise<User>
  abstract getByEmail(email: string, config?: RepositoryQueryConfig): Promise<User>
  abstract getAll(config?: RepositoryQueryConfig): Promise<User[]>

  /** ---- MUTATIONS ---- */
  abstract create(user: User): Promise<User>

  // Templates
  abstract getTemplatesByUserId(userId: string, config: { raw: true }): Promise<TemplateModel[]>
  abstract getTemplatesByUserId(userId: string, config?: RepositoryQueryConfig): Promise<Template[]>
  abstract addTemplate(props: { user: User; template: Template }): Promise<Template>
  abstract updateTemplate(props: { user: User; template: Template }): Promise<Template>
  abstract removeTemplate(props: { user: User; templateId: Template['id'] }): Promise<void>

  // Labels
  abstract getLabelsByUserId(userId: string, config: { raw: true }): Promise<LabelModel[]>
  abstract getLabelsByUserId(userId: string, config?: RepositoryQueryConfig): Promise<Label[]>

  abstract addLabelToUser(props: { user: User; label: Label }): Promise<Label>
  abstract removeLabel(props: { user: User; labelId: Label['id'] }): Promise<void>
}
