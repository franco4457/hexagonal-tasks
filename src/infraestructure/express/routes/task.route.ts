import { type TaskRepository } from '@/domain/task'
import e from 'express'
import { TaskController } from '../controllers/task.controller'

export class TaskRouter {
  private readonly taskRouter = e.Router()
  private readonly taskController
  constructor(taskRepository: TaskRepository) {
    this.taskController = new TaskController(taskRepository)
  }

  start(): e.Router {
    this.taskRouter.get('/', this.taskController.getAll.bind(this.taskController))
    this.taskRouter.post('/', this.taskController.create.bind(this.taskController))
    return this.taskRouter
  }
}
