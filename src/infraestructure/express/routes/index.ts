import type { UserRepository } from '@/domain/user'
import type { TaskRepository } from '@/domain/task'
import e from 'express'
import { UserRouter } from './user.route'
import { healthRouter } from './health.route'
import { TaskRouter } from './task.route'
export class MainRouter {
  private readonly mainRouter = e.Router()
  private readonly userRouter: UserRouter
  private readonly taskRouter: TaskRouter
  constructor(userRepository: UserRepository, taskRepository: TaskRepository) {
    this.userRouter = new UserRouter(userRepository)
    this.taskRouter = new TaskRouter(taskRepository)
  }

  start(): e.Router {
    this.mainRouter.use('/health', healthRouter)
    this.mainRouter.use('/user', this.userRouter.start())
    this.mainRouter.use('/task', this.taskRouter.start())
    return this.mainRouter
  }
}
