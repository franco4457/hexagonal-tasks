import { Task, TaskRepository, TaskNotFound } from '@domain/task'
import { PostgresDataSource } from '..'
import { TaskEntity } from './entity'
import type { IUserRepository } from '@domain/user'

export class PostgresTaskRepository extends TaskRepository {
  private readonly taskRepo
  constructor({ aggregates = {} }: { aggregates?: { userRepo?: IUserRepository } } = {}) {
    super({ aggregates })
    this.taskRepo = PostgresDataSource.getRepository(TaskEntity)
  }

  async getById(id: string): Promise<Task> {
    try {
      const user = await this.taskRepo.findOne({ where: { id } })
      if (user == null) throw new TaskNotFound(id)
      return new Task(user)
    } catch (error) {
      console.log('POSTGRES getById', error)
      throw error
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const tasks = await this.taskRepo.find()
      return tasks.map((task) => new Task(task))
    } catch (error) {
      console.log('POSTGRES getTasks', error)
      throw error
    }
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      const tasks = await this.taskRepo.find({ where: { userId } })
      return tasks.map((task) => new Task(task))
    } catch (error) {
      console.log('POSTGRES getTasksByUserId', error)
      throw error
    }
  }

  async getTask(id: string): Promise<Task> {
    try {
      const task = await this.taskRepo.findOne({ where: { id } })
      if (task == null) {
        throw new TaskNotFound(id)
      }
      return new Task(task)
    } catch (error) {
      console.log('POSTGRES getTask', error)
      throw error
    }
  }

  async create(newTask: Task): Promise<Task> {
    try {
      const task = Task.create(newTask)
      const taskEntity = new TaskEntity()
      Object.assign(taskEntity, task)
      await this.taskRepo.save(taskEntity)
      return task
    } catch (error) {
      console.log('POSTGRES create', error)
      throw error
    }
  }

  async setUser(id: string, userId: string): Promise<void> {
    try {
      const user = await this.aggregates.userRepo?.getById(userId)
      const task = await this.taskRepo.findOne({ where: { id } })
      if (task == null) throw new TaskNotFound(id)

      task.userId = user?.id ?? null
      await this.taskRepo.save(task)
    } catch (error) {
      console.log('POSTGRES setUser', error)
      throw error
    }
  }
}
