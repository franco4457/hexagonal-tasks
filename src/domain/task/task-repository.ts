import type EventEmitter2 from 'eventemitter2'
import { type LoggerPort, RepositoryBase } from '../core'
import type { User, IUserRepository } from '../user'
import { type Task, type TaskModel } from './task.entity'
import { TaskMapper } from './task.mapper'

export interface ITaskRepository {
  create: ((task: Task) => Promise<Task>) & ((task: Task[]) => Promise<Task[]>)
  getTask: (id: Task['id']) => Promise<Task>
  getTasks: () => Promise<Task[]>
  getTasksByUserId: (userId: User['id']) => Promise<Task[]>

  updateLabels: (props: { task: Task }) => Promise<void>

  updateProject: (props: { task: Task }) => Promise<void>
}
export abstract class TaskRepository
  extends RepositoryBase<Task, TaskModel>
  implements ITaskRepository
{
  readonly repositoryName = 'TaskRepository'
  protected readonly mapper = new TaskMapper()
  protected aggregates: { userRepo?: IUserRepository } = {}
  constructor({ ...props }: { logger: LoggerPort; eventEmitter: EventEmitter2 }) {
    super({ ...props, mapper: new TaskMapper() })
  }
  abstract getTasks(): Promise<Task[]>
  abstract getTasksByUserId(userId: User['id']): Promise<Task[]>
  abstract getTask(id: Task['id']): Promise<Task>
  abstract create(task: Task): Promise<Task>
  abstract create(task: Task[]): Promise<Task[]>
  abstract create(task: Task | Task[]): Promise<Task | Task[]>

  abstract updateLabels(props: { task: Task }): Promise<void>

  abstract updateProject(props: { task: Task }): Promise<void>
}
