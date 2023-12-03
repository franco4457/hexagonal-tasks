import { validateTask, type ITaskInput, type Task, type TaskRepository } from '@/domain/task'
import { type IUser } from '@/domain/user'
export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}
  async create(props: { task: ITaskInput; userId: IUser['id'] }): Promise<Task> {
    const taskInp = await validateTask(props.task)
    const task = await this.taskRepository.create(taskInp)
    await this.taskRepository.setUser(task.id, props.userId)
    return task
  }
}
