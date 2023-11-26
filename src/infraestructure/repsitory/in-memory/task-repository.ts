import { Task, type ITaskInput, type TaskRepository, type ITask } from '@/domain/task'
import { type IUser } from '@/domain/user'

export class InMemoryTaskRepository implements TaskRepository {
  private readonly tasks: Task[] = []

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

    this.tasks[indexTask].setUser(userId)
  }
}
