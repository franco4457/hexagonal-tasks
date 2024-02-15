import type { UserRepository } from '@/domain/user'
import type { TaskRepository } from '@/domain/task'
import e from 'express'
import { UserRouter } from './user.route'
import { healthRouter } from './health.route'
import { TaskRouter } from './task.route'
import { type TimerRepository } from '@/domain/timer'
import { TimerRouter } from './timer.route'
export class MainRouter {
  private readonly mainRouter = e.Router()
  private readonly userRouter: UserRouter
  private readonly taskRouter: TaskRouter
  private readonly timerRouter: TimerRouter
  constructor(
    userRepository: UserRepository,
    taskRepository: TaskRepository,
    timerRepository: TimerRepository
  ) {
    this.userRouter = new UserRouter(userRepository)
    this.taskRouter = new TaskRouter(taskRepository)
    this.timerRouter = new TimerRouter(timerRepository)
  }

  start(): e.Router {
    this.mainRouter.use('/health', healthRouter)
    this.mainRouter.use('/user', this.userRouter.start())
    this.mainRouter.use('/task', this.taskRouter.start())
    this.mainRouter.use('/timer', this.timerRouter.start())
    return this.mainRouter
  }
}
