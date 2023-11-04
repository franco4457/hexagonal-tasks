import { randomUUID } from 'node:crypto'
import { type IUser } from '../user'

export interface ITask {
  id: string
  title: string
  description: string
  userId: IUser['id'] | null
}

export type ITaskInput = Omit<ITask, 'id' | 'userId'>

export class Task implements ITask {
  id: string
  title: string
  description: string
  userId: string | null
  constructor({ description, title }: ITaskInput) {
    this.id = randomUUID()
    this.description = description
    this.title = title
    this.userId = null
  }

  setUser(userId: IUser['id']): IUser['id'] {
    this.userId = userId
    return userId
  }
}
