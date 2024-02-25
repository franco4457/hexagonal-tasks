import { ValidationError, ValueObject } from '@/domain/core'

export interface TaskTemplateProps {
  name: string
  description: string
  order: number
  pomodoroEstimated: number
  projectId: string | null
}

export class TaskTemplate extends ValueObject<TaskTemplateProps> {
  protected validate(value: TaskTemplateProps): void {
    const { name, description, order, pomodoroEstimated, projectId } = value
    if (name?.length < 3) {
      throw new ValidationError('Template name must be at least 3 characters long')
    }
    if (description?.length < 3) {
      throw new ValidationError('Template description must be at least 3 characters long')
    }
    if (order < 0) {
      throw new ValidationError('Template order must be greater than 0')
    }
    if (pomodoroEstimated < 0) {
      throw new ValidationError('Template pomodoroEstimated must be greater than 0')
    }
    if (projectId != null && projectId.length < 3) {
      throw new ValidationError('Template projectId must be at least 3 characters long')
    }
  }
}
