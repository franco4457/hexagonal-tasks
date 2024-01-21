import { type Mapper } from '@/domain/core'
import { ProjectResponseDto } from './project.dto'
import { Project, type ProjectModel } from './project.entity'

export class ProjectMapper implements Mapper<Project, ProjectModel, ProjectResponseDto> {
  toDomain(raw: ProjectModel): Project {
    const project = new Project({
      id: raw.id,
      props: {
        name: raw.name,
        userId: raw.userId,
        pomodoroCount: raw.pomodoroCount
      },
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt)
    })

    return project
  }

  toPersistence(project: Project): ProjectModel {
    const copy = project.getProps()
    const record: ProjectModel = {
      id: project.id,
      name: copy.name,
      userId: copy.userId,
      pomodoroCount: copy.pomodoroCount,
      createdAt: copy.createdAt,
      updatedAt: copy.updatedAt
    }

    return record
  }

  toResponse(project: any): ProjectResponseDto {
    const { id, createdAt, updatedAt, ...props } = project.getProps()
    const response = new ProjectResponseDto({ id, createdAt, updatedAt })
    response.name = props.name
    response.userId = props.userId
    response.pomodoroCount = props.pomodoroCount
    return project
  }
}
