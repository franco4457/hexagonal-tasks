import { ListTasks } from '@/application/task/list-tasks'
import { TaskCreateCommand, TaskCreateService } from '@/application/task'
import { TaskMapper, type TaskRepository } from '@/domain/task'
import { type NextFunction, type Request, type Response } from 'express'
export class TaskController {
  private readonly createTask: TaskCreateService
  private readonly listTasks: ListTasks
  private readonly mapper = new TaskMapper()
  constructor(private readonly taskRepository: TaskRepository) {
    this.createTask = new TaskCreateService(this.taskRepository)
    this.listTasks = new ListTasks(this.taskRepository)
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, title, description, order, pomodoro, labels, project } = req.body
      const task = await this.createTask.execute(
        new TaskCreateCommand({
          task: { title, description, order, pomodoro, labels, project },
          userId
        })
      )
      res.status(201).json({ task: this.mapper.toResponse(task) })
    } catch (error) {
      next(error)
    }
  }

  async bulkCreate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { data } = req.body as { data: [] }
      const tasksCreated = await this.createTask.execute(data)
      res.status(201).json({ tasks: tasksCreated.map((task) => this.mapper.toResponse(task)) })
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
