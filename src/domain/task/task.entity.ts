import { randomUUID } from 'node:crypto'
import { type User } from '../user'
import { Entity } from '../core'

export interface TaskProps {
  title: string
  description: string
  isCompleted: boolean
  userId: User['id']
}

export type TaskPropsCreate = Omit<TaskProps, 'id' | 'isCompleted'>

export type TaskModel = Omit<TaskProps, 'isCompleted'> & {
  id: string
  is_completed: boolean
  createdAt: Date
  updatedAt: Date
}

export class Task extends Entity<TaskProps> {
  static create = (task: TaskPropsCreate): Task => {
    const id = randomUUID()
    return new Task({ id, props: { isCompleted: false, ...task } })
  }

  markComplete = (): void => {
    this.props.isCompleted = true
  }

  markIncomplete = (): void => {
    this.props.isCompleted = false
  }
}
