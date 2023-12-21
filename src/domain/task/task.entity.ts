import { randomUUID } from 'node:crypto'
import { type User } from '../user'
import { type AggregateID, Entity } from '../core'

export interface TaskProps {
  title: string
  description: string
  isCompleted: boolean
  userId: User['id']
}

export type TaskPropsCreate = Omit<TaskProps, 'id'>

export type TaskModel = Omit<TaskProps, 'isComplete'> & {
  id: string
  is_completed: boolean
  createdAt: Date
  updatedAt: Date
}

export class Task extends Entity<TaskProps> {
  protected readonly _id!: AggregateID
  static create = (task: TaskPropsCreate): Task => {
    const id = randomUUID()
    return new Task({ id, props: { ...task } })
  }

  markComplete = (): void => {
    this.props.isCompleted = true
  }

  markIncomplete = (): void => {
    this.props.isCompleted = false
  }
}
