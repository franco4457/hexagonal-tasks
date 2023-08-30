import { type ITaskInput, type Task } from './task.entity'

export interface TaskRepository {
  getTasks: () => Promise<Task[]>
  getTask: (id: Task['id']) => Promise<Task>
  create: (newTask: ITaskInput) => Promise<Task>
  setUser: (id: Task['id'], userId: Task['userId']) => Promise<void>
}
