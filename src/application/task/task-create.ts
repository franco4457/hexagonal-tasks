import { valdiateID } from '@/domain/core'
import { validateTask, type TaskPropsCreate, Task, type TaskRepository } from '@/domain/task'
import { Pomodoro } from '@/domain/task/value-objects'
import { type User } from '@/domain/user'

interface CreateTaskProps {
  task: Omit<TaskPropsCreate, 'userId' | 'pomodoro'> & {
    pomodoro: {
      estimated: number
    }
  }
  userId: User['id']
}
export class CreateTask {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(props: CreateTaskProps): Promise<Task>
  async create(props: CreateTaskProps[]): Promise<Task[]>
  async create(props: CreateTaskProps | CreateTaskProps[]): Promise<Task | Task[]> {
    if (Array.isArray(props)) {
      const tasks = await Promise.all(
        props.map(async ({ task: { pomodoro, ...task }, ...p }) => {
          const taskInp = await validateTask(task)
          const userId = await valdiateID(p.userId, 'User ID')
          return Task.create({
            ...taskInp,
            userId,
            pomodoro: new Pomodoro({
              estimated: pomodoro.estimated,
              actual: 0
            })
          })
        })
      )
      await this.taskRepository.transaction(async () => await this.taskRepository.create(tasks))
      return tasks
    } else {
      const {
        task: { pomodoro, ...task },
        ...p
      } = props
      const taskInp = await validateTask(task)
      const userId = await valdiateID(p.userId, 'User ID')
      const newTask = Task.create({
        ...taskInp,
        userId,
        pomodoro: new Pomodoro({ estimated: props.task.pomodoro.estimated, actual: 0 })
      })
      await this.taskRepository.transaction(async () => await this.taskRepository.create(newTask))
      return newTask
    }
  }
}
