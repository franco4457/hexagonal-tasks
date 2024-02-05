import type { Mapper } from '../core/mapper'
import { TaskResponseDto } from './task.dto'
import { Task } from './task.entity'
import type { TaskModel } from './task.entity'
import { Label, Pomodoro, Project } from './value-objects'

export class TaskMapper implements Mapper<Task, TaskModel, TaskResponseDto> {
  toDomain(raw: TaskModel): Task {
    const {
      id,
      createdAt,
      updatedAt,
      is_completed: isCompleted,
      pomodoro_actual: actual,
      pomodoro_estimated: estimated,
      labels,
      project_name: projectName,
      ...props
    } = raw
    const task = new Task({
      props: {
        ...props,
        pomodoro: new Pomodoro({
          actual,
          estimated
        }),
        labels: labels.map((label) => new Label({ name: label.name })),
        project: projectName != null ? new Project({ name: projectName }) : null,
        isCompleted
      },
      id,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    })
    return task
  }

  toPersistence(domain: Task): TaskModel {
    const {
      id,
      createdAt,
      updatedAt,
      isCompleted,
      pomodoro: { value: pomo },
      labels,
      project,
      ...props
    } = domain.getProps()

    const record: TaskModel = {
      ...props,
      is_completed: isCompleted,
      pomodoro_actual: pomo.actual,
      pomodoro_estimated: pomo.estimated,
      id,
      labels: labels.map((label) => ({ name: label.value.name })),
      project_name: project?.value.name ?? null,
      createdAt,
      updatedAt
    }
    return record
  }

  toResponse(domain: Task): TaskResponseDto {
    const { id, createdAt, updatedAt, ...props } = domain.getProps()
    const response = new TaskResponseDto({ id, createdAt, updatedAt })
    response.title = props.title
    response.description = props.description
    response.isCompleted = props.isCompleted
    response.userId = props.userId
    response.labels = props.labels.map((label) => ({ name: label.value.name }))
    response.project = props.project?.value ?? null
    return response
  }
}
