import { type Task, TaskRepository, TaskNotFound, type TaskModel } from '@/domain/task'
import { type IUserRepository, type User, UserNotFound } from '@/domain/user'

export class InMemoryTaskRepository extends TaskRepository {
  private readonly tasks: TaskModel[] = []
  constructor({
    tasks = [],
    aggregates = {}
  }: { tasks?: TaskModel[]; aggregates?: { userRepo?: IUserRepository } } = {}) {
    super({ aggregates })
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

  async create(task: Task): Promise<Task> {
    this.tasks.push(this.mapper.toPersistence(task))
    return task
  }

  async setUser(id: Task['id'], userId: User['id']): Promise<void> {
    const indexTask = this.tasks.findIndex((task) => task.id === id)
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
