import type { IUser } from '../user'
import type { ITask, ITaskInput, Task } from './task.entity'

export interface TaskRepository {
  getTasks: () => Promise<ITask[]>
  getTask: (id: Task['id']) => Promise<Task>
  create: (newTask: ITaskInput) => Promise<Task>
  setUser: (id: Task['id'], userId: IUser['id']) => Promise<void>
}
