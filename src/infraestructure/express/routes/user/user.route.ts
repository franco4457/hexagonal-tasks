import e from 'express'
import { type UserRepository } from '@/domain/user'
import { UserController } from '../../controllers/user'
import { userAuthMiddleware } from '../../middleware'
import { LabelRouter } from './label.route'
import { TemplateRouter } from './template.route'
export class UserRouter {
  private readonly userRouter = e.Router()
  private readonly labelRouter: LabelRouter
  private readonly templateRouter: TemplateRouter
  private readonly userController
  constructor(private readonly userRepository: UserRepository) {
    this.userController = new UserController(this.userRepository)
    this.labelRouter = new LabelRouter(this.userRepository)
    this.templateRouter = new TemplateRouter(this.userRepository)
  }

  start(): e.Router {
    this.userRouter.post('/register', this.userController.register.bind(this.userController))
    this.userRouter.post('/login', this.userController.login.bind(this.userController))
    // XXX: check if this is necessary only for testing purposes or if it should be removed
    this.userRouter.get('/all', this.userController.getAll.bind(this.userController))

    // Protected routes
    this.userRouter.use(userAuthMiddleware)
    this.userRouter.get('/', this.userController.getUser.bind(this.userController))

    // Nested routes (protected as well)
    this.userRouter.use('/label', this.labelRouter.start())
    this.userRouter.use('/template', this.templateRouter.start())

    return this.userRouter
  }
}
