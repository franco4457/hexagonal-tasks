import { randomUUID } from 'node:crypto'
import type { User } from '../user'
import { AggregateRoot } from '../core'
import {
  TaskCreateEvent,
  TaskMarkCompleted,
  TaskMarkIncompleted,
  TaskUpdateActualPomodoroEvent,
  TaskUpdateEstimatedPomodoroEvent
} from './events'
import { Pomodoro } from './value-objects'

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

  updateEstimatedPomodoro = (estimated: number): void => {
    const newPomodoro = new Pomodoro({ estimated, actual: this.props.pomodoro.value.actual })
    this.addEvent(
      new TaskUpdateEstimatedPomodoroEvent({
        aggregateId: this.id,
        ...newPomodoro.value
      })
    )
    this.props.pomodoro = newPomodoro
  }

  updateActualPomodoro = (): void => {
    const newPomodoro = new Pomodoro({
      estimated: this.props.pomodoro.value.estimated,
      actual: this.props.pomodoro.value.actual + 1
    })
    this.addEvent(
      new TaskUpdateActualPomodoroEvent({
        aggregateId: this.id,
        ...newPomodoro.value
      })
    )
    this.props.pomodoro = newPomodoro
  }
}
