import e from 'express'
import { type UserRepository } from '@/domain/user'
import { TemplateController } from '../../controllers/user'
export class TemplateRouter {
  private readonly templateRouter = e.Router()
  private readonly templateController
  constructor(private readonly userRepository: UserRepository) {
    this.templateController = new TemplateController(this.userRepository)
  }

  start(): e.Router {
    this.templateRouter.get('/', this.templateController.getTemplates.bind(this.templateController))

    this.templateRouter.post('/', this.templateController.addTemplate.bind(this.templateController))
    this.templateRouter.put(
      '/',
      this.templateController.updateTemplate.bind(this.templateController)
    )
    this.templateRouter.delete(
      '/:templateId',
      this.templateController.removeTemplate.bind(this.templateController)
    )
    return this.templateRouter
  }
}
