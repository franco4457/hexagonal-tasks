import { randomUUID } from 'node:crypto'
import type { User } from '../user'
import { AggregateRoot, ValidationError, isEmpty } from '../core'
import {
  TaskAddLabelEvent,
  TaskCreateEvent,
  TaskMarkCompleted,
  TaskMarkIncompleted,
  TaskRemoveLabelEvent,
  TaskRemoveProjectEvent,
  TaskUpdateActualPomodoroEvent,
  TaskUpdateEstimatedPomodoroEvent,
  TaskUpdateProjectEvent
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
  project: Project | null
}

export type TaskPropsCreate = Omit<TaskProps, 'isCompleted' | 'labels' | 'project'>

export type TaskModel = Omit<TaskProps, 'isCompleted' | 'pomodoro' | 'labels' | 'project'> & {
  id: string
  is_completed: boolean
  podomoro_estimated: number
  podomoro_actual: number
  labels: Array<{ id: string; name: string }>
  project: { id: string; name: string } | null
  createdAt: Date
  updatedAt: Date
}

export class Task extends AggregateRoot<TaskProps> {
  static create(task: TaskPropsCreate): Task {
    const id = randomUUID()
    const newTask = new Task({
      id,
      props: { ...task, isCompleted: false, labels: [], project: null }
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

  updateProject({ id, name }: { id?: string; name: string }): void {
    const newProject = id != null ? new Project({ id, name }) : Project.create({ name })
    this.props.project = newProject
    this.addEvent(
      new TaskUpdateProjectEvent({
        aggregateId: this.id,
        projectId: newProject.value.id,
        projectName: newProject.value.name,
        userId: this.props.userId
      })
    )
  }

  removeProject(): void {
    if (this.props.project === null) return
    this.props.project = null
    this.addEvent(
      new TaskRemoveProjectEvent({
        aggregateId: this.id,
        userId: this.props.userId
      })
    )
  }

  public validate(): void {
    const { title, description, order, pomodoro, userId, isCompleted, labels, project } = this.props
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
    if (project !== null && !Project.isValueObject(project)) {
      throw new ValidationError('project should be a Project instance')
    }
  }
}
