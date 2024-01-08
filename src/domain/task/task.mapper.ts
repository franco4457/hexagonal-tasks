import type { Mapper } from '../core/mapper'
import { TaskResponseDto } from './task.dto'
import { Task } from './task.entity'
import type { TaskModel } from './task.entity'
import { Pomodoro } from './value-objects'

export class TaskMapper implements Mapper<Task, TaskModel, TaskResponseDto> {
  toDomain(raw: TaskModel): Task {
    const {
      id,
      createdAt,
      updatedAt,
      is_completed: isCompleted,
      podomoro_actual: actual,
      podomoro_estimated: estimated,
      ...props
    } = raw
    const task = new Task({
      props: {
        ...props,
        pomodoro: new Pomodoro({
          actual,
          estimated
        }),
        isCompleted
      },
      id,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt)
    })
    return task
  }

  toPersistence(domain: Task): TaskModel {
    const { id, createdAt, updatedAt, isCompleted, pomodoro, ...props } = domain.getProps()
    const pomo = pomodoro.value
    const record: TaskModel = {
      ...props,
      is_completed: isCompleted,
      podomoro_actual: pomo.actual,
      podomoro_estimated: pomo.estimated,
      id,
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
    return response
  }
}
