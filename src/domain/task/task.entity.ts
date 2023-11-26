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
  readonly id: string
  readonly title: string
  readonly description: string
  userId: string | null
  constructor({ description, title, id, userId }: ITask) {
    this.id = id
    this.description = description
    this.title = title
    this.userId = userId
  }

  static create = (task: ITaskInput): Task => {
    const id = randomUUID() as string
    return new Task({ ...task, id, userId: null })
  }

  setUser(userId: IUser['id']): IUser['id'] {
    this.userId = userId
    return userId
  }
}
