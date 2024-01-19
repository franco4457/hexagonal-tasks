import { randomUUID } from 'crypto'
import { AggregateRoot, isEmpty } from '../core'
import { ProjectCreateEvent } from './event'

export interface ProjectProps {
  name: string
  userId: string
}

// TODO: Fix extends Record<string, unknown> throw type error on ProjectRepository
export interface ProjectModel extends ProjectProps, Record<string, unknown> {
  id: string
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export class Project extends AggregateRoot<ProjectProps> {
  public static create(props: ProjectProps): Project {
    const id = randomUUID()
    const project = new Project({ id, props })
    project.addEvent(
      new ProjectCreateEvent({ aggregateId: id, name: props.name, userId: props.userId })
    )
    return project
  }

  public validate(): void {
    const { name, userId } = this.props
    if (isEmpty(name)) {
      throw new Error('Project name must be at least 3 characters long')
    }
    if (isEmpty(userId)) {
      throw new Error('Project userId must be at least 3 characters long')
    }
  }
}
