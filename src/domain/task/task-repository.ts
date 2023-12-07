import type { IUser, IUserRepository } from '../user'
import type { ITask, ITaskInput, Task } from './task.entity'

export interface ITaskRepository {
  getTasks: () => Promise<ITask[]>
  getTasksByUserId: (userId: IUser['id']) => Promise<ITask[]>
  getTask: (id: Task['id']) => Promise<Task>
  create: (newTask: ITaskInput) => Promise<Task>
  setUser: (id: Task['id'], userId: IUser['id']) => Promise<void>
}
export abstract class TaskRepository implements ITaskRepository {
  readonly repositoryName = 'TaskRepository'
  protected aggregates: { userRepo?: IUserRepository } = {}
  constructor({ aggregates = {} }: { aggregates?: { userRepo?: IUserRepository } } = {}) {
    this.aggregates = aggregates
  }
  abstract getTasks(): Promise<ITask[]>
  abstract getTasksByUserId(userId: IUser['id']): Promise<ITask[]>
  abstract getTask(id: Task['id']): Promise<Task>
  abstract create(newTask: ITaskInput): Promise<Task>
  abstract setUser(id: Task['id'], userId: IUser['id']): Promise<void>
}
