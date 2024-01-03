import { randomUUID } from 'node:crypto'
import { type User } from '../user'
import { AggregateRoot } from '../core'
import { TaskCreateEvent } from './events'

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

export class Task extends AggregateRoot<TaskProps> {
  static create = (task: TaskPropsCreate): Task => {
    const id = randomUUID()
    const newTask = new Task({ id, props: { isCompleted: false, ...task } })
    newTask.addEvent(
      new TaskCreateEvent({ aggregateId: newTask.id, title: task.title, userId: task.userId })
    )
    return newTask
  }

  markComplete = (): void => {
    this.props.isCompleted = true
  }

  markIncomplete = (): void => {
    this.props.isCompleted = false
  }
}
