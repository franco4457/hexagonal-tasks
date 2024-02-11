import { type IQueryHandler, QueryBase } from '@/domain/core'
import { type TaskModel, type TaskRepository } from '@/domain/task'

export class TaskByUserIdQuery extends QueryBase {
  readonly userId: string
  readonly sortByOrder: boolean
  constructor(props: { userId: string; sortByOrder: boolean }) {
    super()
    this.userId = props.userId
    this.sortByOrder = props.sortByOrder
  }
}

export class TaskByUserIdQueryHandler implements IQueryHandler<TaskByUserIdQuery, TaskModel[]> {
  constructor(private readonly taskRepository: TaskRepository) {}
  async execute(query: TaskByUserIdQuery): Promise<TaskModel[]> {
    if (query.sortByOrder) {
      return await this.taskRepository.getTasksByUserIdSortedBy(query.userId, {
        raw: true,
        order: 'ASC',
        sortBy: 'order'
      })
    }
    return await this.taskRepository.getTasksByUserId(query.userId, { raw: true })
  }
}
