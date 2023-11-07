import e from 'express'
import {
  getUserController,
  loginController,
  registerController
} from '../dependecies/user.dependecie'
import { type IUserRepository } from '@/domain/user'

export const userRouter = e.Router()

userRouter.get('/', getUserController.all.bind(getUserController))

userRouter.post('/login', loginController.run.bind(loginController))
userRouter.post('/register', registerController.run.bind(registerController))

export class UserRouter {
  constructor(private readonly userRepository: IUserRepository) {}

  start(): e.Router {
    return userRouter
  }
}
