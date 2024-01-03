import { valdiateID } from '@/domain/core'
import { validateTask, type TaskPropsCreate, Task, type TaskRepository } from '@/domain/task'
import { type User } from '@/domain/user'

interface CreateTaskProps {
  task: Omit<TaskPropsCreate, 'userId'>
  userId: User['id']
}
export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(props: CreateTaskProps): Promise<Task>
  async create(props: CreateTaskProps[]): Promise<Task[]>
  async create(props: CreateTaskProps | CreateTaskProps[]): Promise<Task | Task[]> {
    if (Array.isArray(props)) {
      const tasks = await Promise.all(
        props.map(async (p) => {
          const taskInp = await validateTask(p.task)
          const userId = await valdiateID(p.userId, 'User ID')
          return Task.create({ ...taskInp, userId })
        })
      )
      await this.taskRepository.transaction(async () => await this.taskRepository.create(tasks))
      return tasks
    } else {
      const taskInp = await validateTask(props.task)
      const userId = await valdiateID(props.userId, 'User ID')
      const task = Task.create({ ...taskInp, userId })
      await this.taskRepository.transaction(async () => await this.taskRepository.create(task))
      return task
    }
  }
}
