import { ArgumentNotProvided, ValueObject, isEmpty } from '@domain/core'

interface ProjectProps {
  name: string
}

type ProjectPropsCreate = Omit<ProjectProps, 'id'>

export class Project extends ValueObject<ProjectProps> {
  static create = ({ name }: ProjectPropsCreate): Project => {
    return new Project({ name })
  }

  get name(): string {
    return this.value.name
  }

  public validate(value: ProjectProps): void {
    if (isEmpty(value.name)) {
      throw new ArgumentNotProvided('Project name cannot be empty')
    }
    if (isEmpty(value)) {
      throw new ArgumentNotProvided('Project cannot be empty')
    }
  }
}
