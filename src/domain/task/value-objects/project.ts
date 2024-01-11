import { ArgumentNotProvided, ValueObject, isEmpty } from '@/domain/core'
import { randomUUID } from 'crypto'

interface ProjectProps {
  name: string
  id: string
}

type ProjectPropsCreate = Omit<ProjectProps, 'id'>

export class Project extends ValueObject<ProjectProps> {
  static create = ({ name }: ProjectPropsCreate): Project => {
    const id = randomUUID()
    return new Project({ id, name })
  }

  public validate(): void {
    if (isEmpty(this.value.id)) {
      throw new ArgumentNotProvided('Project id cannot be empty')
    }
    if (isEmpty(this.value.name)) {
      throw new ArgumentNotProvided('Project name cannot be empty')
    }
    if (isEmpty(this.value)) {
      throw new ArgumentNotProvided('Project cannot be empty')
    }
  }
}
