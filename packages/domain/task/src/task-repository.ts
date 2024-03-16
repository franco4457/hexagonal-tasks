import type EventEmitter2 from 'eventemitter2'
import { type LoggerPort, RepositoryBase, type RepositoryQueryConfig } from '@domain/core'
import type { User } from '@domain/user'
import { type Task, type TaskModel } from './task.entity'
import { TaskMapper } from './task.mapper'

export interface SortOptions extends RepositoryQueryConfig {
  order: 'ASC' | 'DESC'
  sortBy: keyof TaskModel
}
export interface ITaskRepository {
  // TODO: Separate create method into two methods or only acepts array of tasks
  create: (task: Task | Task[]) => Promise<Task | Task[]>
  getTask: (id: Task['id']) => Promise<Task>
  getTasks: () => Promise<Task[]>

  getTasksByUserId: (
    userId: User['id'],
    config?: RepositoryQueryConfig
  ) => Promise<Task[] | TaskModel[]>

  getTasksByUserIdSortedBy: <Q extends SortOptions>(
    userId: string,
    config: Q
  ) => Promise<Q['raw'] extends true ? TaskModel[] : Task[]>

  updateLabels: (props: { task: Task }) => Promise<void>

  updateProject: (props: { task: Task }) => Promise<void>
}

export abstract class TaskRepository
  extends RepositoryBase<Task, TaskModel>
  implements ITaskRepository
{
  readonly repositoryName = 'TaskRepository'
  protected readonly mapper = new TaskMapper()
  constructor({ ...props }: { logger: LoggerPort; eventEmitter: EventEmitter2 }) {
    super({ ...props, mapper: new TaskMapper() })
  }
  abstract getTasks(): Promise<Task[]>
  abstract getTask(id: Task['id']): Promise<Task>

  abstract getTasksByUserId(userId: User['id'], config: { raw: true }): Promise<TaskModel[]>
  abstract getTasksByUserId(userId: User['id'], config?: RepositoryQueryConfig): Promise<Task[]>

  abstract getTasksByUserIdSortedBy<Q extends SortOptions>(
    userId: string,
    config: Q
  ): Promise<Q['raw'] extends true ? TaskModel[] : Task[]>

  abstract create(task: Task): Promise<Task>
  abstract create(task: Task[]): Promise<Task[]>
  abstract create(task: Task | Task[]): Promise<Task | Task[]>

  abstract updateLabels(props: { task: Task }): Promise<void>

  abstract updateProject(props: { task: Task }): Promise<void>
}
