import {
  type Task,
  TaskRepository,
  TaskNotFound,
  type TaskModel,
  type Label,
  type Project
} from '@/domain/task'
import { type User } from '@/domain/user'
import { Logger } from '@/infraestructure/logger'
import type EventEmitter2 from 'eventemitter2'

export class InMemoryTaskRepository extends TaskRepository {
  private readonly tasks: TaskModel[] = []
  constructor({
    tasks = [],
    appContext,
    eventEmitter
  }: {
    tasks?: TaskModel[]
    appContext?: string
    eventEmitter: EventEmitter2
  }) {
    super({
      logger: new Logger({ appContext, context: InMemoryTaskRepository.name }),
      eventEmitter
    })
    this.tasks = tasks
  }

  async getTasks(): Promise<Task[]> {
    return this.tasks.map((task) => this.mapper.toDomain(task))
  }

  async getTasksByUserId(userId: User['id']): Promise<Task[]> {
    return this.tasks
      .filter((task) => task.userId === userId)
      .map((task) => this.mapper.toDomain(task))
  }

  async getTask(id: string): Promise<Task> {
    const task = this.tasks.find((task) => task.id === id)
    if (task == null) {
      throw new TaskNotFound(id)
    }
    return this.mapper.toDomain(task)
  }

  async create(task: Task): Promise<Task>
  async create(task: Task[]): Promise<Task[]>
  async create(task: Task | Task[]): Promise<Task | Task[]> {
    const tasksIds = Array.isArray(task) ? task.map((t) => t.id) : [task.id]
    this.logger.debug(
      `creating ${tasksIds.length} entities to "task" table: ${tasksIds.join(', ')}`
    )
    if (Array.isArray(task)) {
      await Promise.all(
        task.map(async (t) => {
          await this.save(t, async () => {
            this.tasks.push(this.mapper.toPersistence(t))
          })
        })
      )
      return task
    }
    await this.save(task, async () => {
      this.tasks.push(this.mapper.toPersistence(task))
    })
    return task
  }

  async addLabel(props: { taskId: string; label: Label }): Promise<void> {
    const taskIdx = this.tasks.findIndex((task) => task.id === props.taskId)
    if (taskIdx === -1) {
      throw new TaskNotFound(props.taskId)
    }
    this.tasks[taskIdx].labels.push({
      id: props.label.value.id,
      name: props.label.value.name
    })
  }

  async removeLabel(props: { taskId: string; label: Label }): Promise<void> {
    const taskIdx = this.tasks.findIndex((task) => task.id === props.taskId)
    if (taskIdx === -1) {
      throw new TaskNotFound(props.taskId)
    }
    this.tasks[taskIdx].labels = this.tasks[taskIdx].labels.filter(
      (label) => label.id !== props.label.value.id
    )
  }

  async addProject(props: { taskId: string; project: Project }): Promise<void> {
    const taskIdx = this.tasks.findIndex((task) => task.id === props.taskId)
    if (taskIdx === -1) {
      throw new TaskNotFound(props.taskId)
    }
    const pValue = props.project.value
    this.tasks[taskIdx].project = {
      id: pValue.id,
      name: pValue.name
    }
  }

  async removeProject(props: { taskId: string; project: Project }): Promise<void> {
    const taskIdx = this.tasks.findIndex((task) => task.id === props.taskId)
    if (taskIdx === -1) {
      throw new TaskNotFound(props.taskId)
    }
    this.tasks[taskIdx].project = null
  }
}
