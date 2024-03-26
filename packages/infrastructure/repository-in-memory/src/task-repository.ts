import type { EventBus, RepositoryQueryConfig } from '@domain/core'
import {
  type Task,
  TaskRepository,
  TaskNotFound,
  type TaskModel,
  type SortOptions
} from '@domain/task'
import { type User } from '@domain/user'
import { Logger } from '@infrastructure/logger'

// Temporary workaround to avoid type errors
type TypedReturn<T extends SortOptions> = T['raw'] extends true ? TaskModel[] : Task[]
export class InMemoryTaskRepository extends TaskRepository {
  private readonly tasks: TaskModel[] = []
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
      logger: new Logger({ appContext, context: InMemoryTaskRepository.name }),
      eventBus
    })
    this.tasks = tasks
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks.map((task) => this.mapper.toDomain(task))
  }

  async getTasksByUserId(userId: User['id'], config: { raw: true }): Promise<TaskModel[]>
  async getTasksByUserId(userId: User['id'], config?: RepositoryQueryConfig): Promise<Task[]>
  async getTasksByUserId(
    userId: User['id'],
    config?: RepositoryQueryConfig
  ): Promise<Task[] | TaskModel[]> {
    const tasks = this.tasks.filter((task) => task.userId === userId)
    return config?.raw === true ? tasks : tasks.map((task) => this.mapper.toDomain(task))
  }

  async getTask(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id)
    if (task == null) {
      throw new TaskNotFound(id)
    }
    return this.mapper.toDomain(task)
  }

  async create(task: Task): Promise<Task>
  async create(task: Task[]): Promise<Task[]>
  async create(task: Task | Task[]): Promise<Task | Task[]> {
    const tasksIds = Array.isArray(task) ? task.map((t) => t.id) : [task.id]
    this.logger.debug(
      `creating ${tasksIds.length} entities to "task" table: ${tasksIds.join(', ')}`
    )
    if (Array.isArray(task)) {
      await Promise.all(
        task.map(async (t) => {
          await this.save(t, async () => {
            this.tasks.push(this.mapper.toPersistence(t))
          })
        })
      )
      return task
    }
    await this.save(task, async () => {
      this.tasks.push(this.mapper.toPersistence(task))
    })
    return task
  }

  async getTasksByUserIdSortedBy<Q extends SortOptions>(
    userId: string,
    config: Q
  ): Promise<Q['raw'] extends true ? TaskModel[] : Task[]> {
    const tasks = this.tasks.filter((task) => task.userId === userId)
    if (config == null) {
      return tasks.map((task) => this.mapper.toDomain(task)) as TypedReturn<Q>
    }
    const order = config.order === 'ASC'
    const sortedTasks = tasks.sort((aProp, bProp) => {
      const a = aProp[config.sortBy]
      const b = bProp[config.sortBy]
      if (a == null || b == null) {
        return 0
      }
      if (typeof a === 'number' && typeof b === 'number') {
        return order ? a - b : b - a
      }
      if (typeof a === 'string' && typeof b === 'string') {
        return order ? a.localeCompare(b) : b.localeCompare(a)
      }
      return 0
    })

    return config?.raw === true
      ? // eslint-disable-line
        // FIXME: This is a workaround to avoid type errors
        (sortedTasks as TypedReturn<Q>)
      : (sortedTasks.map((task) => this.mapper.toDomain(task)) as TypedReturn<Q>)
  }

  async updateLabels(props: { task: Task }): Promise<void> {
    const taskIdx = this.tasks.findIndex((task) => task.id === props.task.id)
    if (taskIdx === -1) {
      throw new TaskNotFound(props.task.id)
    }
    this.tasks[taskIdx].labels = props.task.getProps().labels.map((label) => ({
      name: label.value.name
    }))
  }

  async updateProject(props: { task: Task }): Promise<void> {
    const taskIdx = this.tasks.findIndex((task) => task.id === props.task.id)
    if (taskIdx === -1) {
      throw new TaskNotFound(props.task.id)
    }

    this.tasks[taskIdx].project_name = props.task.getProps().project?.name ?? null
  }
}
