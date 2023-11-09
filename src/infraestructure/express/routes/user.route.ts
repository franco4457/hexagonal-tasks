import e from 'express'
import { type IUserRepository } from '@/domain/user'
import { UserController } from '../controllers/user.controller'
export class UserRouter {
  private readonly userRouter = e.Router()
  private readonly userController
  constructor(private readonly userRepository: IUserRepository) {
    this.userController = new UserController(this.userRepository)
  }

  start(): e.Router {
    this.userRouter.get('/', this.userController.getAll.bind(this.userController))

    this.userRouter.post('/register', this.userController.register.bind(this.userController))
    this.userRouter.post('/login', this.userController.login.bind(this.userController))
    return this.userRouter
  }
}
