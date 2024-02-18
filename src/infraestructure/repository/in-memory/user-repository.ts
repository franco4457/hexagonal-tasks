import { type RepositoryQueryConfig } from '@/domain/core'
import {
  UserRepository,
  type User,
  type UserModel,
  type Label,
  type Template,
  type TemplateModel,
  type LabelModel
} from '@/domain/user'
import { UserAlreadyExist, UserNotFound, UserPropNotFound } from '@/domain/user/user.exceptions'
import { Logger } from '@/infraestructure/logger'
import type EventEmitter2 from 'eventemitter2'

export class InMemoryUserRepository extends UserRepository {
  private readonly users: UserModel[] = [
    {
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      password: '$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u',
      username: 'tested',
      labels: [],
      templates: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  constructor({
    users,
    ...props
  }: {
    users?: UserModel[]
    appContext?: string
    eventEmitter: EventEmitter2
  }) {
    super({
      ...props,
      logger: new Logger({ context: InMemoryUserRepository.name, appContext: props.appContext })
    })
    if (users != null) this.users = users
  }

  private userFinder({ value, key = 'id' }: { value: string; key?: keyof UserModel }): {
    user: UserModel
    userIndex: number
  } {
    const idx = this.users.findIndex((user) => user[key] === value)
    if (idx === -1) throw new UserNotFound(value, key)
    return {
      user: this.users[idx],
      userIndex: idx
    }
  }

  /* ------ QUERY METHODS ------ */
  async getById(id: string): Promise<User> {
    const { user } = this.userFinder({ value: id })
    return this.mapper.toDomain(user)
  }

  async getByEmail(email: string): Promise<User> {
    const { user } = this.userFinder({ value: email, key: 'email' })
    return this.mapper.toDomain(user)
  }

  async getAll(): Promise<User[]> {
    return this.users.map((user) => this.mapper.toDomain(user))
  }

  async getTemplatesByUserId(userId: string, config: { raw: true }): Promise<TemplateModel[]>
  async getTemplatesByUserId(userId: string, config?: RepositoryQueryConfig): Promise<Template[]>
  async getTemplatesByUserId(
    userId: string,
    config?: RepositoryQueryConfig
  ): Promise<TemplateModel[] | Template[]> {
    const { user } = this.userFinder({ value: userId })
    return config?.raw === true
      ? user.templates
      : user.templates.map(this.mapper.templateMapper.toDomain)
  }

  async getLabelsByUserId(userId: string, config: { raw: true }): Promise<LabelModel[]>
  async getLabelsByUserId(userId: string, config?: RepositoryQueryConfig): Promise<Label[]>
  async getLabelsByUserId(
    userId: string,
    config?: RepositoryQueryConfig
  ): Promise<Label[] | LabelModel[]> {
    const { user } = this.userFinder({ value: userId })
    return config?.raw === true ? user.labels : user.labels.map(this.mapper.labelMapper.toDomain)
  }

  /* ------ COMMANDS METHODS ------ */
  async create(user: User): Promise<User> {
    this.logger.debug('creating 1 entities to "user" table:', user.id)
    if (this.users.some((u) => u.email === user.getProps().email)) {
      throw new UserAlreadyExist(user.getProps().email, 'email')
    }
    await this.save(user, async () => {
      this.users.push(this.mapper.toPersistence(user))
    }).catch((err) => {
      this.logger.error(err)
    })
    return user
  }

  async addTemplate(props: { user: User; template: Template }): Promise<Template> {
    this.logger.debug('adding 1 template to user:', props.user.id)
    const { userIndex: idx } = this.userFinder({ value: props.user.id })

    await this.save(props.user, async () => {
      this.users[idx].templates.push(this.mapper.templateMapper.toPersistence(props.template))
      this.users[idx].updatedAt = new Date()
    })
    return props.template
  }

  async updateTemplate(props: { user: User; template: Template }): Promise<Template> {
    this.logger.debug('updating 1 template to user:', props.user.id)
    const { userIndex: idx } = this.userFinder({ value: props.user.id })

    const templateIdx = this.users[idx].templates.findIndex((temp) => temp.id === props.template.id)
    if (templateIdx === -1) {
      throw new UserPropNotFound<'templates'>(props.template.id, 'templates[number].id')
    }
    await this.save(props.user, async () => {
      this.users[idx].templates[templateIdx] = this.mapper.templateMapper.toPersistence(
        props.template
      )
      this.users[idx].templates[templateIdx].updatedAt = new Date()
      this.users[idx].updatedAt = new Date()
    })
    return props.template
  }

  async removeTemplate(props: { user: User; templateId: string }): Promise<void> {
    this.logger.debug('removing 1 template to user:', props.user.id)
    const { userIndex: idx } = this.userFinder({ value: props.user.id })

    const templateIdx = this.users[idx].templates.findIndex((temp) => temp.id === props.templateId)
    if (templateIdx === -1) {
      throw new UserPropNotFound<'templates'>(props.templateId, 'templates[number].id')
    }

    await this.save(props.user, async () => {
      this.users[idx].templates.splice(templateIdx, 1)
      this.users[idx].updatedAt = new Date()
    })
  }

  async addLabelToUser(props: { user: User; label: Label }): Promise<Label> {
    this.logger.debug('adding 1 label to user:', props.user.id)
    const { userIndex: idx } = this.userFinder({ value: props.user.id })

    await this.save(props.user, async () => {
      this.users[idx].labels.push(this.mapper.labelMapper.toPersistence(props.label))
      this.users[idx].updatedAt = new Date()
    })

    return props.label
  }

  async removeLabel(props: { user: User; labelId: string }): Promise<void> {
    this.logger.debug('removing 1 label to user:', props.user.id)
    const { userIndex: idx } = this.userFinder({ value: props.user.id })

    const labelIdx = this.users[idx].labels.findIndex((label) => label.id === props.labelId)
    if (labelIdx === -1) {
      throw new UserPropNotFound<'labels'>(props.labelId, 'labels[number].id')
    }
    await this.save(props.user, async () => {
      this.users[idx].labels.splice(labelIdx, 1)
      this.users[idx].updatedAt = new Date()
    })
  }
}
