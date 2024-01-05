import { type Task, TaskRepository, TaskNotFound, type TaskModel } from '@/domain/task'
import { type User, UserNotFound } from '@/domain/user'
import { Logger } from '@/infraestructure/logger'
import type EventEmitter2 from 'eventemitter2'

export class InMemoryTaskRepository extends TaskRepository {
  private readonly tasks: TaskModel[] = []
  constructor({
    tasks = [],
    appContext,
    eventEmitter
  }: {
    tasks?: TaskModel[]
    appContext?: string
    eventEmitter: EventEmitter2
  }) {
    super({
      logger: new Logger({ appContext, context: InMemoryTaskRepository.name }),
      eventEmitter
    })
    this.tasks = tasks
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks.map((task) => this.mapper.toDomain(task))
  }

  async getTasksByUserId(userId: User['id']): Promise<Task[]> {
    return this.tasks
      .filter((task) => task.userId === userId)
      .map((task) => this.mapper.toDomain(task))
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

  async setUser(id: Task['id'], userId: User['id'], idxTask?: number): Promise<void> {
    const indexTask = idxTask ?? this.tasks.findIndex((task) => task.id === id)
    if (indexTask === -1) {
      throw new TaskNotFound(id)
    }
    try {
      const user = await this.aggregates.userRepo?.getById(userId)
      if (user == null) {
        throw new UserNotFound(userId)
      }
      this.tasks[indexTask].userId = userId
    } catch (error) {
      this.tasks.splice(indexTask, 1)
      throw error
    }
  }
}
