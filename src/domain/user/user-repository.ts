import type EventEmitter2 from 'eventemitter2'
import { type LoggerPort, RepositoryBase } from '../core'
import type { User, UserModel } from './user.entity'
import { UserMapper } from './user.mapper'
import { type Label, type Template } from './entities'

export interface IUserRepository {
  getById: (id: string) => Promise<User>
  getByEmail: (email: string) => Promise<User>
  getAll: () => Promise<User[]>
  create: (user: User) => Promise<User>

  addTemplate: (props: { user: User; template: Template }) => Promise<Template>
  getTemplatesByUserId: (userId: string) => Promise<Template[]>
  updateTemplate: (props: { user: User; template: Template }) => Promise<Template>
  removeTemplate: (props: { user: User; templateId: Template['id'] }) => Promise<void>

  addLabelToUser: (props: { user: User; label: Label }) => Promise<Label>
  getLabelsByUserId: (userId: string) => Promise<Label[]>
  removeLabel: (props: { user: User; labelId: Label['id'] }) => Promise<void>
}

export abstract class UserRepository
  extends RepositoryBase<User, UserModel>
  implements IUserRepository
{
  readonly repositoryName = 'UserRepository'
  constructor(props: { logger: LoggerPort; eventEmitter: EventEmitter2 }) {
    super({ ...props, mapper: new UserMapper() })
  }

  protected readonly mapper = new UserMapper()
  abstract getById(id: string): Promise<User>
  abstract getByEmail(email: string): Promise<User>
  abstract getAll(): Promise<User[]>
  abstract create(user: User): Promise<User>

  // Templates
  abstract addTemplate(props: { user: User; template: Template }): Promise<Template>
  abstract getTemplatesByUserId(userId: string): Promise<Template[]>
  abstract updateTemplate(props: { user: User; template: Template }): Promise<Template>
  abstract removeTemplate(props: { user: User; templateId: Template['id'] }): Promise<void>

  // Labels
  abstract addLabelToUser(props: { user: User; label: Label }): Promise<Label>
  abstract getLabelsByUserId(userId: string): Promise<Label[]>
  abstract removeLabel(props: { user: User; labelId: Label['id'] }): Promise<void>
}
