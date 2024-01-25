import {
  type ProjectRepository,
  Project,
  type CreateProjectProps,
  validateCreateProject
} from '@/domain/project'

export class ProjectCreate {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async create(props: CreateProjectProps): Promise<Project> {
    const projectInput = await validateCreateProject(props)
    const project = Project.create(projectInput)
    await this.projectRepository.transaction(async () => {
      await this.projectRepository.create(project)
    })
    return project
  }
}
