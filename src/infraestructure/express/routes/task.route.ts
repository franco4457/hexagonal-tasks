import { type TaskRepository } from '@/domain/task'
import e from 'express'
import { TaskController } from '../controllers/task'

export class TaskRouter {
  private readonly taskRouter = e.Router()
  private readonly taskController
  constructor(taskRepository: TaskRepository) {
    this.taskController = new TaskController(taskRepository)
  }

  start(): e.Router {
    this.taskRouter.post('/', this.taskController.createTask)
    return this.taskRouter
  }
}
