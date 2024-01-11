import { randomUUID } from 'node:crypto'
import type { User } from '../user'
import { AggregateRoot, ValidationError, isEmpty } from '../core'
import {
  TaskAddLabelEvent,
  TaskCreateEvent,
  TaskMarkCompleted,
  TaskMarkIncompleted,
  TaskRemoveLabelEvent,
  TaskUpdateActualPomodoroEvent,
  TaskUpdateEstimatedPomodoroEvent,
  TaskUpdateProyectEvent
} from './events'
import { Label, Pomodoro, Project } from './value-objects'
import { TaskFieldIsRequired } from './task.exceptions'

export interface TaskProps {
  title: string
  description: string
  isCompleted: boolean
  order: number
  pomodoro: Pomodoro
  labels: Label[]
  userId: User['id']
  proyect: Project | null
}

export type TaskPropsCreate = Omit<TaskProps, 'isCompleted' | 'labels' | 'proyect'>

export type TaskModel = Omit<TaskProps, 'isCompleted' | 'pomodoro'> & {
  id: string
  is_completed: boolean
  podomoro_estimated: number
  podomoro_actual: number
  createdAt: Date
  updatedAt: Date
}

export class Task extends AggregateRoot<TaskProps> {
  static create(task: TaskPropsCreate): Task {
    const id = randomUUID()
    const newTask = new Task({
      id,
      props: { ...task, isCompleted: false, labels: [], proyect: null }
    })
    newTask.addEvent(
      new TaskCreateEvent({ aggregateId: newTask.id, title: task.title, userId: task.userId })
    )
    return newTask
  }

  markCompleted(): void {
    this.addEvent(new TaskMarkCompleted({ aggregateId: this.id, userId: this.props.userId }))
    this.props.isCompleted = true
  }

  markIncompleted(): void {
    this.addEvent(new TaskMarkIncompleted({ aggregateId: this.id, userId: this.props.userId }))
    this.props.isCompleted = false
  }

  updateEstimatedPomodoro(estimated: number): void {
    const newPomodoro = new Pomodoro({ estimated, actual: this.props.pomodoro.value.actual })
    this.addEvent(
      new TaskUpdateEstimatedPomodoroEvent({
        aggregateId: this.id,
        ...newPomodoro.value
      })
    )
    this.props.pomodoro = newPomodoro
  }

  updateActualPomodoro(): void {
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

  addLabel(label: Label): void {
    this.props.labels.push(label)
    this.addEvent(
      new TaskAddLabelEvent({
        aggregateId: this.id,
        labelId: label.value.id,
        userId: this.props.userId
      })
    )
  }

  removeLabel(labelId: string): void {
    const labelIdx = this.props.labels.findIndex((label) => label.value.id === labelId)
    if (labelIdx === -1) return
    this.props.labels = this.props.labels.filter((_, i) => i !== labelIdx)
    this.addEvent(
      new TaskRemoveLabelEvent({
        aggregateId: this.id,
        labelId,
        userId: this.props.userId
      })
    )
  }

  updateProyect(proyect: { name: string }): void {
    const newProyect = Project.create(proyect)
    this.props.proyect = newProyect
    this.addEvent(
      new TaskUpdateProyectEvent({
        aggregateId: this.id,
        proyectId: newProyect.value.id,
        proyectName: newProyect.value.name,
        userId: this.props.userId
      })
    )
  }

  public validate(): void {
    const { title, description, order, pomodoro, userId, isCompleted, labels, proyect } = this.props
    if (isEmpty(title)) throw new TaskFieldIsRequired('title')
    if (isEmpty(description)) throw new TaskFieldIsRequired('description')
    if (isEmpty(order)) throw new TaskFieldIsRequired('order')
    if (isEmpty(userId)) throw new TaskFieldIsRequired('userId')
    if (isEmpty(isCompleted)) throw new TaskFieldIsRequired('isCompleted')
    if (!Pomodoro.isValueObject(pomodoro)) {
      throw new ValidationError('pomodoro should be a Pomodoro instance')
    }
    if (!labels.every((label) => Label.isValueObject(label))) {
      throw new ValidationError('labels should be a Label instance')
    }
    if (proyect !== null && !Project.isValueObject(proyect)) {
      throw new ValidationError('proyect should be a Project instance')
    }
  }
}
