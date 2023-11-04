import { type ITaskInput, type Task, type TaskRepository } from '@/domain/task'
import { type IUser } from '@/domain/user'
export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}
  async create(props: { task: ITaskInput; userId: IUser['id'] }): Promise<Task> {
    const task = await this.taskRepository.create(props.task)
    await this.taskRepository.setUser(task.id, props.userId)
    task.setUser(props.userId)
    return task
  }
}
