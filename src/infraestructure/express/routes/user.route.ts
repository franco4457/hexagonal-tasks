import e from 'express'
import { type UserRepository } from '@/domain/user'
import { UserController } from '../controllers/user.controller'
import { userAuthMiddleware } from '../middleware'
export class UserRouter {
  private readonly userRouter = e.Router()
  private readonly userController
  constructor(private readonly userRepository: UserRepository) {
    this.userController = new UserController(this.userRepository)
  }

  start(): e.Router {
    this.userRouter.post('/register', this.userController.register.bind(this.userController))
    this.userRouter.post('/login', this.userController.login.bind(this.userController))
    // XXX: check if this is necessary only for testing purposes or if it should be removed
    this.userRouter.get('/all', this.userController.getAll.bind(this.userController))

    this.userRouter.get(
      '/',
      userAuthMiddleware,
      this.userController.getUser.bind(this.userController)
    )
    return this.userRouter
  }
}
