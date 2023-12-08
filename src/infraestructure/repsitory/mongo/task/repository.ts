import { TaskRepository, Task, type ITask, type ITaskInput } from '@/domain/task'
import { conn } from '../connect'
import { TaskModel } from './model'
import { type IUserRepository } from '@/domain/user'

export class MongoTaskRepository extends TaskRepository {
  private taskModel!: typeof TaskModel

  constructor({ aggregates = {} }: { aggregates?: { userRepo?: IUserRepository } } = {}) {
    super({ aggregates })
    if (this.taskModel != null) {
      return this
    }

    conn()
      .then(() => {
        this.taskModel = TaskModel
      })
      .catch((error) => {
        console.log('MONGO_TASK conn', error)
        throw new Error('Unable to connect to database')
      })
  }

  getTasks = async (): Promise<ITask[]> => {
    try {
      const repoTasks = await this.taskModel.find()
      const tasks = repoTasks.map(
        (repoTask) =>
          ({
            id: repoTask.id,
            title: repoTask.title,
            description: repoTask.description,
            userId: repoTask.userId
          } satisfies ITask)
      )
      return tasks
    } catch (error) {
      console.log('MONGO_TASK getTasks', error)
      throw new Error('Unable to get tasks')
    }
  }

  getTasksByUserId = async (userId: string): Promise<ITask[]> => {
    try {
      const repoTasks = await this.taskModel.find({ userId })
      const tasks = repoTasks.map(
        (repoTask) =>
          ({
            id: repoTask.id,
            title: repoTask.title,
            description: repoTask.description,
            userId: repoTask.userId
          } satisfies ITask)
      )
      return tasks
    } catch (error) {
      console.log('MONGO_TASK getTasksByUserId', error)
      throw new Error('Unable to get tasks')
    }
  }

  getTask = async (id: string): Promise<Task> => {
    try {
      const repoTask = await this.taskModel.findById(id)
      if (repoTask == null) throw new Error('Task not found')
      const task = new Task(repoTask)
      return task
    } catch (error) {
      console.log('MONGO_TASK getTask', error)
      throw new Error('Unable to get task')
    }
  }

  create = async (newTask: ITaskInput): Promise<Task> => {
    try {
      const task = Task.create(newTask)
      await this.taskModel.create({ ...task, _id: task.id })
      return task
    } catch (error) {
      console.log('MONGO_TASK create', error)
      throw new Error('Unable to create task')
    }
  }

  setUser = async (id: string, userId: string): Promise<void> => {
    try {
      const user = await this.aggregates?.userRepo?.getById(userId)
      if (user == null) throw new Error('User not found')
      const repoTask = await this.taskModel.findByIdAndUpdate(id, { userId: user.id })
      if (repoTask == null) throw new Error('Task not found')
    } catch (error) {
      await this.taskModel.deleteOne({ _id: id })
      throw error
    }
  }
}
