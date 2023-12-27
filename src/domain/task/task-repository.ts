import type { User, IUserRepository } from '../user'
import type { Task } from './task.entity'
import { TaskMapper } from './task.mapper'

export interface ITaskRepository {
  getTasks: () => Promise<Task[]>
  getTasksByUserId: (userId: User['id']) => Promise<Task[]>
  getTask: (id: Task['id']) => Promise<Task>
  create: (newTask: Task) => Promise<Task>
  setUser: (id: Task['id'], userId: User['id']) => Promise<void>
}
export abstract class TaskRepository implements ITaskRepository {
  readonly repositoryName = 'TaskRepository'
  protected readonly mapper = new TaskMapper()
  protected aggregates: { userRepo?: IUserRepository } = {}
  constructor({ aggregates = {} }: { aggregates?: { userRepo?: IUserRepository } } = {}) {
    this.aggregates = aggregates
  }
  abstract getTasks(): Promise<Task[]>
  abstract getTasksByUserId(userId: User['id']): Promise<Task[]>
  abstract getTask(id: Task['id']): Promise<Task>
  abstract create(newTask: Task): Promise<Task>
  abstract setUser(id: Task['id'], userId: User['id']): Promise<void>
}
