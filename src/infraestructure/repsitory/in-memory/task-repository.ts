import { Task, type ITaskInput, TaskRepository, type ITask } from '@/domain/task'
import { type IUserRepository, type IUser, UserNotFound } from '@/domain/user'

export class InMemoryTaskRepository extends TaskRepository {
  private readonly tasks: Task[] = []
  constructor({
    tasks = [],
    aggregates = {}
  }: { tasks?: Task[]; aggregates?: { userRepo?: IUserRepository } } = {}) {
    super({ aggregates })
    this.tasks = tasks
  }

  async getTasks(): Promise<ITask[]> {
    return this.tasks
  }

  async getTasksByUserId(userId: IUser['id']): Promise<ITask[]> {
    return this.tasks.filter((task) => task.userId === userId)
  }

  async getTask(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id)
    if (task == null) {
      throw new Error('Task not found')
    }
    return new Task(task)
  }

  async create(newTask: ITaskInput): Promise<Task> {
    const task = Task.create(newTask)
    this.tasks.push(task)
    return task
  }

  async setUser(id: Task['id'], userId: IUser['id']): Promise<void> {
    const indexTask = this.tasks.findIndex((task) => task.id === id)
    if (indexTask === -1) {
      throw new Error('Task not found')
    }
    try {
      const user = await this.aggregates.userRepo?.getById(userId)
      if (user == null) {
        throw new UserNotFound(userId)
      }
      this.tasks[indexTask].setUser(user.id)
    } catch (error) {
      this.tasks.splice(indexTask, 1)
      throw error
    }
  }
}
