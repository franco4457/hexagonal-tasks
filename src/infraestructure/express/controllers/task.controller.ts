import { CreateTask } from '@/application/task/task-create'
import { type TaskRepository } from '@/domain/task'
import { type Request, type Response } from 'express'
export class TaskController {
  private readonly createTask: CreateTask
  constructor(private readonly taskRepository: TaskRepository) {
    this.createTask = new CreateTask(this.taskRepository)
  }

  async create(req: Request, res: Response): Promise<void> {
    const { userId, title, description } = req.body

    const task = await this.createTask.create({ task: { title, description }, userId })
    res.status(201).json(task)
  }
}
