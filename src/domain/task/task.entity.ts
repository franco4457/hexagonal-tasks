import { randomUUID } from 'node:crypto'
import type { User } from '../user'
import { AggregateRoot } from '../core'
import { TaskCreateEvent, TaskMarkCompleted, TaskMarkIncompleted } from './events'
import { type Pomodoro } from './value-objects'

export interface TaskProps {
  title: string
  description: string
  isCompleted: boolean
  order: number
  pomodoro: Pomodoro
  userId: User['id']
}

export type TaskPropsCreate = Omit<TaskProps, 'id' | 'isCompleted'>

export type TaskModel = Omit<TaskProps, 'isCompleted' | 'pomodoro'> & {
  id: string
  is_completed: boolean
  podomoro_estimated: number
  podomoro_actual: number
  createdAt: Date
  updatedAt: Date
}

// TODO: add guards
export class Task extends AggregateRoot<TaskProps> {
  static create = (task: TaskPropsCreate): Task => {
    const id = randomUUID()
    const newTask = new Task({ id, props: { isCompleted: false, ...task } })
    newTask.addEvent(
      new TaskCreateEvent({ aggregateId: newTask.id, title: task.title, userId: task.userId })
    )
    return newTask
  }

  markCompleted = (): void => {
    this.addEvent(new TaskMarkCompleted({ aggregateId: this.id, userId: this.props.userId }))
    this.props.isCompleted = true
  }

  markIncompleted = (): void => {
    this.addEvent(new TaskMarkIncompleted({ aggregateId: this.id, userId: this.props.userId }))
    this.props.isCompleted = false
  }
}
