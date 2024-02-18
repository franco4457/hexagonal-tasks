import type { UserRepository } from '@/domain/user'
import type { TaskRepository } from '@/domain/task'
import e from 'express'
import { UserRouter } from './user'
import { healthRouter } from './health.route'
import { TaskRouter } from './task.route'
import { type TimerRepository } from '@/domain/timer'
import { TimerRouter } from './timer.route'
import { ProjectRouter } from './project.route'
import { type ProjectRepository } from '@/domain/project'
export class MainRouter {
  private readonly mainRouter = e.Router()
  private readonly userRouter: UserRouter
  private readonly taskRouter: TaskRouter
  private readonly timerRouter: TimerRouter
  private readonly projectRouter: ProjectRouter
  constructor(
    userRepository: UserRepository,
    taskRepository: TaskRepository,
    timerRepository: TimerRepository,
    projectRepository: ProjectRepository
  ) {
    this.userRouter = new UserRouter(userRepository)
    this.taskRouter = new TaskRouter(taskRepository)
    this.timerRouter = new TimerRouter(timerRepository)
    this.projectRouter = new ProjectRouter(projectRepository)
  }

  start(): e.Router {
    this.mainRouter.use('/health', healthRouter)
    this.mainRouter.use('/user', this.userRouter.start())
    this.mainRouter.use('/task', this.taskRouter.start())
    this.mainRouter.use('/timer', this.timerRouter.start())
    this.mainRouter.use('/project', this.projectRouter.start())
    return this.mainRouter
  }
}
