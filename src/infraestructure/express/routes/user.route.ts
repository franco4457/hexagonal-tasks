import e from 'express'
import {
  getUserController,
  loginController,
  registerController
} from '../dependecies/user.dependecie'

export const userRouter = e.Router()

userRouter.get('/', getUserController.all.bind(getUserController))

userRouter.post('/login', loginController.run.bind(loginController))
userRouter.post('/register', registerController.run.bind(registerController))
