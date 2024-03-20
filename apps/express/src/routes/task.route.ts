import { type TaskRepository } from '@domain/task'
import e from 'express'
import { TaskController } from '../controllers/task.controller'
import { userAuthMiddleware } from '../middleware'

export class TaskRouter {
  private readonly taskRouter = e.Router()
  private readonly taskController
  constructor(taskRepository: TaskRepository) {
    this.taskController = new TaskController(taskRepository)
  }

  start(): e.Router {
    this.taskRouter.get(
      '/',
      userAuthMiddleware,
      this.taskController.getByUserId.bind(this.taskController)
    )
    this.taskRouter.get('/all', this.taskController.getAll.bind(this.taskController))
    // XXX: check if this is necessary only for testing purposes
    this.taskRouter.post(
      '/',
      userAuthMiddleware,
      this.taskController.create.bind(this.taskController)
    )
    this.taskRouter.post(
      '/bulk',
      userAuthMiddleware,
      this.taskController.bulkCreate.bind(this.taskController)
    )

    this.taskRouter.get('/:userId', this.taskController.getByUserId.bind(this.taskController))

    return this.taskRouter
  }
}
