import { type TaskRepository } from '@/domain/task'
import { type IUserRepository } from '@/domain/user'
import type EventEmitter2 from 'eventemitter2'

export interface IApiBuilder {
  reset: () => IApiBuilder
  getRepoConfig: () => {
    eventEmitter: EventEmitter2
    appContext?: string
  }
  setTaskRepository: (taskRepository: TaskRepository) => IApiBuilder
  setUserRepository: (userRepository: IUserRepository) => IApiBuilder
  build: () => any
}
