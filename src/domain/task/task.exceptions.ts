import { NotFound } from '../core'
import { type ITask } from './task.entity'

export class TaskNotFound extends NotFound {
  constructor(id: string, field: keyof ITask = 'id') {
    super(`Task with ${field}: ${id} not found`)
  }
}
