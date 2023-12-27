import { valdiateID } from '@/domain/core'
import { validateTask, type TaskPropsCreate, Task, type TaskRepository } from '@/domain/task'
import { type User } from '@/domain/user'
export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}
  async create(props: {
    task: Omit<TaskPropsCreate, 'userId'>
    userId: User['id']
  }): Promise<Task> {
    const taskInp = await validateTask(props.task)
    const userId = await valdiateID(props.userId, 'User ID')
    const task = Task.create({ ...taskInp, userId })
    await this.taskRepository.create(task)
    return task
  }
}
