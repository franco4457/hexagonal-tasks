import { ListTasks } from '@/application/task/list-tasks'
import { CreateTask } from '@/application/task/task-create'
import { TaskMapper, type TaskRepository } from '@/domain/task'
import { type NextFunction, type Request, type Response } from 'express'
export class TaskController {
  private readonly createTask: CreateTask
  private readonly listTasks: ListTasks
  private readonly mapper = new TaskMapper()
  constructor(private readonly taskRepository: TaskRepository) {
    this.createTask = new CreateTask(this.taskRepository)
    this.listTasks = new ListTasks(this.taskRepository)
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, title, description } = req.body
      const task = await this.createTask.create({ task: { title, description }, userId })
      res.status(201).json({ task: this.mapper.toResponse(task) })
    } catch (error) {
      next(error)
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await this.listTasks.getAll()
      res.status(200).json({ tasks: tasks.map((task) => this.mapper.toResponse(task)) })
    } catch (error) {
      next(error)
    }
  }

  async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params
      const tasks = await this.listTasks.getByUserId(userId)
      res.status(200).json({ tasks: tasks.map((task) => this.mapper.toResponse(task)) })
    } catch (error) {
      next(error)
    }
  }
}
