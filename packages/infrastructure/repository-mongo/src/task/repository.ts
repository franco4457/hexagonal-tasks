import {
  TaskRepository,
  type Task,
  TaskNotFound,
  type TaskModel,
  type SortOptions
} from '@domain/task'
import { conn } from '../connect'
import { TaskMongoModel } from './model'
import { type User } from '@domain/user'
import { Logger } from '@infrastructure/logger'
import type { EventBus, RepositoryQueryConfig } from '@domain/core'
import type mongoose from 'mongoose'

type TypedReturn<T extends SortOptions> = T['raw'] extends true ? TaskModel[] : Task[]
export class MongoTaskRepository extends TaskRepository {
  private mongoose: typeof mongoose | null = null

  private readonly taskModel = TaskMongoModel

  constructor({
    tasks = [],
    appContext,
    eventBus
  }: {
    tasks?: TaskModel[]
    appContext?: string
    eventBus: EventBus
  }) {
    super({
      logger: new Logger({ appContext, context: MongoTaskRepository.name }),
      eventBus
    })
    this.taskModel.insertMany(tasks).catch((error) => {
      this.logger.error('Error inserting tasks', error)
    })
  }

  private async conn(): Promise<typeof mongoose> {
    if (this.mongoose != null) return this.mongoose
    this.mongoose = await conn()
    await this.taskModel.init()
    return this.mongoose
  }

  async getTasks(): Promise<Task[]> {
    try {
      await this.conn()
      const repoTasks = await this.taskModel.find()
      const tasks = repoTasks.map(this.mapper.toDomain.bind(this))
      return tasks
    } catch (error) {
      console.log('MONGO_TASK getTasks', error)
      throw error
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      await this.conn()
      const repoTask = await this.taskModel.findOne({ id })
      if (repoTask == null) throw new TaskNotFound(id)
      return this.mapper.toDomain(repoTask)
    } catch (error) {
      console.log('MONGO_TASK getTask', error)
      throw error
    }
  }

  async getTasksByUserIdSortedBy<Q extends SortOptions>(
    userId: string,
    config: Q
  ): Promise<Q['raw'] extends true ? TaskModel[] : Task[]> {
    try {
      await this.conn()
      const repoTasks = await this.taskModel
        .find({ userId })
        .sort([[config.sortBy, config.order === 'ASC' ? 1 : -1]])
      return config?.raw === true
        ? (repoTasks as unknown as TypedReturn<Q>)
        : (repoTasks.map((task) => this.mapper.toDomain(task)) as TypedReturn<Q>)
    } catch (error) {
      console.log('MONGO_TASK getTasksByUserIdSortedBy', error)
      throw error
    }
  }

  async getTasksByUserId(userId: User['id'], config: { raw: true }): Promise<TaskModel[]>
  async getTasksByUserId(userId: User['id'], config?: RepositoryQueryConfig): Promise<Task[]>
  async getTasksByUserId(
    userId: User['id'],
    config?: RepositoryQueryConfig
  ): Promise<Task[] | TaskModel[]> {
    try {
      await this.conn()
      const repoTasks = await this.taskModel.find({ userId })
      return config?.raw === true ? repoTasks : repoTasks.map(this.mapper.toDomain.bind(this))
    } catch (error) {
      console.log('MONGO_TASK getTasksByUserId', error)
      throw error
    }
  }

  async create(task: Task): Promise<Task>
  async create(task: Task[]): Promise<Task[]>
  async create(task: Task | Task[]): Promise<Task | Task[]> {
    const tasksIds = Array.isArray(task) ? task.map((t) => t.id) : [task.id]
    this.logger.debug(
      `creating ${tasksIds.length} entities to "task" table: ${tasksIds.join(', ')}`
    )
    const tasks = Array.isArray(task) ? task : [task]
    try {
      await Promise.all(
        tasks.map(async (t) => {
          await this.save(t, async () => {
            await this.conn()
            await this.taskModel.create({ ...this.mapper.toPersistence(t) })
          })
        })
      )
      return task
    } catch (error) {
      console.log('MONGO_TASK create', error)
      throw error
    }
  }

  async updateLabels(props: { task: Task }): Promise<void> {
    this.logger.debug('updating labels to task:', props.task.id)
    try {
      await this.save(props.task, async () => {
        await this.conn()
        const task = await this.taskModel.findOne({ id: props.task.id })
        if (task == null) throw new TaskNotFound(props.task.id)
        task.labels = props.task.getProps().labels.map((label) => ({ name: label.name }))
        await task.save()
      })
    } catch (error) {
      console.log('MONGO_TASK updateLabels', error)
      throw error
    }
  }

  async updateProject(props: { task: Task }): Promise<void> {
    this.logger.debug('updating project to task:', props.task.id)
    try {
      await this.save(props.task, async () => {
        await this.conn()
        const task = await this.taskModel.findOne({ id: props.task.id })
        if (task == null) throw new TaskNotFound(props.task.id)
        task.project_name = props.task.getProps().project?.name ?? null
        await task.save()
      })
    } catch (error) {
      console.log('MONGO_TASK updateProject', error)
      throw error
    }
  }
}
