import { randomUUID } from 'crypto'
import { AggregateRoot, ValidationError, isEmpty } from '@domain/core'
import { ProjectCreateEvent, ProjectSumPomodoroCountEvent } from './event'

export interface ProjectProps {
  name: string
  userId: string
  pomodoroCount: number
}

export interface ProjectModel extends ProjectProps, Record<string, unknown> {
  id: string
  pomodoroCount: number
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type CreateProjectProps = Omit<ProjectProps, 'pomodoroCount'>
export class Project extends AggregateRoot<ProjectProps> {
  public static create(props: CreateProjectProps): Project {
    const id = randomUUID()
    const project = new Project({ id, props: { ...props, pomodoroCount: 0 } })
    project.addEvent(
      new ProjectCreateEvent({ aggregateId: id, name: props.name, userId: props.userId })
    )
    return project
  }

  sumPomodoroCount(): void {
    this.props.pomodoroCount += 1
    this.addEvent(
      new ProjectSumPomodoroCountEvent({
        aggregateId: this.id,
        actCounter: this.props.pomodoroCount
      })
    )
  }

  public validate(): void {
    const { name, userId, pomodoroCount } = this.props
    if (isEmpty(name)) {
      throw new ValidationError('Project name must be at least 3 characters long')
    }
    if (isEmpty(userId)) {
      throw new ValidationError('Project userId must be at least 3 characters long')
    }
    if (pomodoroCount < 0) {
      throw new ValidationError('Project pomodoroCount must be greater than 0')
    }
  }
}
