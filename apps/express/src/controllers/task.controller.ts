import { ListTasks } from '@application/task'
import {
  TaskByUserIdQuery,
  TaskByUserIdQueryHandler,
  TaskCreateCommand,
  TaskCreateService
} from '@application/task'
import { TaskMapper, type TaskRepository } from '@domain/task'
import { type NextFunction, type Request, type Response } from 'express'

export class TaskController {
  private readonly createTask: TaskCreateService
  private readonly listTasks: ListTasks
  private readonly queryByUserId: TaskByUserIdQueryHandler
  private readonly mapper = new TaskMapper()
  constructor(private readonly taskRepository: TaskRepository) {
    this.createTask = new TaskCreateService(this.taskRepository)
    this.listTasks = new ListTasks(this.taskRepository)
    this.queryByUserId = new TaskByUserIdQueryHandler(this.taskRepository)
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      const { title, description, order, pomodoro, labels, project } = req.body
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
    const { id: userId } = req.userAuth.decodedToken
    try {
      const { data } = req.body as { data: [] }
      const tasksCreated = await this.createTask.execute(
        data.map(({ task }) => new TaskCreateCommand({ task, userId }))
      )
      res.status(201).json({ tasks: tasksCreated.map(this.mapper.toResponse.bind(this)) })
    } catch (error) {
      next(error)
    }
  }

  // TODO: Normalize the responses
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tasks = await this.listTasks.getAll()
      res.status(200).json({ tasks: tasks.map((task) => this.mapper.toResponse(task)) })
    } catch (error) {
      next(error)
    }
  }

  private resolveUserId(req: Request): string {
    const { userId } = req.params
    if (userId != null) return userId
    return req.userAuth.decodedToken.id
  }

  async getByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: test this
      const { sort = 'true' } = req.query
      const query = new TaskByUserIdQuery({
        userId: this.resolveUserId(req),
        sortByOrder: sort === 'true'
      })
      const tasks = this.queryByUserId.execute(query)
      res.status(200).json({ tasks })
    } catch (error) {
      next(error)
    }
  }
}
