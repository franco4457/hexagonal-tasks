import { Entity, ValidationError } from '@/domain/core'
import { randomUUID } from 'crypto'
import { type TaskTemplateProps, type TaskTemplate } from '../value-objects'

export interface TemplateProps {
  name: string
  tasks: TaskTemplate[]
}

export interface TemplateModel extends Omit<TemplateProps, 'tasks'> {
  id: string
  tasks: TaskTemplateProps[]
  createdAt: Date
  updatedAt: Date
}

export class Template extends Entity<TemplateProps> {
  public static create(props: TemplateProps): Template {
    const id = randomUUID()
    return new Template({ props, id })
  }

  validate(): void {
    const { name, tasks } = this.props
    if (name.length < 3) {
      throw new ValidationError('Template name must be at least 3 characters long')
    }
    if (tasks.length < 1) {
      throw new ValidationError('Template must have at least one task')
    }
  }
}
