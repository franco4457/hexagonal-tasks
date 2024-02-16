import { type ProjectRepository } from '@/domain/project'
import { ProjectController } from '../controllers/project.controller'
import e from 'express'
import { userAuthMiddleware } from '../middleware'
export class ProjectRouter {
  private readonly projectRouter = e.Router()
  private readonly projectController: ProjectController
  constructor(private readonly projectRepository: ProjectRepository) {
    this.projectController = new ProjectController(this.projectRepository)
  }

  start(): e.Router {
    this.projectRouter.post(
      '/',
      userAuthMiddleware,
      this.projectController.create.bind(this.projectController)
    )
    this.projectRouter.get(
      '/',
      userAuthMiddleware,
      this.projectController.getProject.bind(this.projectController)
    )
    return this.projectRouter
  }
}
