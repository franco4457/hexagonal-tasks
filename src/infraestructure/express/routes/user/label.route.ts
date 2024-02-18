import e from 'express'
import { type UserRepository } from '@/domain/user'
import { LabelController } from '../../controllers/user'
export class LabelRouter {
  private readonly labelRouter = e.Router()
  private readonly labelController
  constructor(private readonly userRepository: UserRepository) {
    this.labelController = new LabelController(this.userRepository)
  }

  start(): e.Router {
    this.labelRouter.get('/', this.labelController.getLabels.bind(this.labelController))
    this.labelRouter.post('/', this.labelController.addLabel.bind(this.labelController))

    this.labelRouter.delete(
      '/:labelId',
      this.labelController.removeLabel.bind(this.labelController)
    )
    return this.labelRouter
  }
}
