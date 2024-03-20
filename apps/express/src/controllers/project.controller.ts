import {
  ProjectByUserIdQueryHandler,
  ProjectCreateCommand,
  ProjectCreateService
} from '@application/project'
import { ProjectMapper, type ProjectRepository } from '@domain/project'
import { type Request, type NextFunction, type Response } from 'express'
export class ProjectController {
  private readonly projectCreateService: ProjectCreateService
  private readonly projectByUserIdQuery: ProjectByUserIdQueryHandler
  private readonly mapper = new ProjectMapper()

  constructor(private readonly projectRepository: ProjectRepository) {
    this.projectCreateService = new ProjectCreateService(this.projectRepository)
    this.projectByUserIdQuery = new ProjectByUserIdQueryHandler(this.projectRepository)
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    const { id } = req.userAuth.decodedToken
    try {
      const project = await this.projectCreateService.execute(
        new ProjectCreateCommand({
          ...body,
          userId: id
        })
      )
      res.status(200).json({ project: this.mapper.toResponse(project) })
    } catch (error) {
      next(error)
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.userAuth.decodedToken
      const projects = await this.projectByUserIdQuery.execute({ userId: id })
      res.status(200).json({ projects: projects.map(this.mapper.toResponse) })
    } catch (error) {
      next(error)
    }
  }
}
