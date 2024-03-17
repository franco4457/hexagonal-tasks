import { type ProjectRepository, Project, validateCreateProject } from '@domain/project'
import { type ProjectCreateCommand } from './project-create.command'
import { type ICommandHandler } from '@domain/core'

export class ProjectCreateService implements ICommandHandler<ProjectCreateCommand, Project> {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(command: ProjectCreateCommand): Promise<Project> {
    const projectInput = await validateCreateProject(command)
    const project = Project.create(projectInput)
    await this.projectRepository.transaction(async () => {
      await this.projectRepository.create(project)
    })
    return project
  }
}
