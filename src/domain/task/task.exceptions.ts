import { IsRequired, NotFound } from '../core'
import { type Task } from './task.entity'

export class TaskNotFound extends NotFound {
  constructor(id: string, field: keyof Task = 'id') {
    super(`Task with ${field}: ${id} not found`)
  }
}

export class TaskFieldIsRequired extends IsRequired<keyof Task | keyof Task['props']> {}
