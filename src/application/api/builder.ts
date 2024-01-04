import { type TaskRepository } from '@/domain/task'
import { type UserRepository } from '@/domain/user'
import type EventEmitter2 from 'eventemitter2'

export interface IApiBuilder {
  reset: () => IApiBuilder
  getRepoConfig: () => {
    eventEmitter: EventEmitter2
    appContext?: string
  }
  setTaskRepository: (taskRepository: TaskRepository) => IApiBuilder
  setUserRepository: (userRepository: UserRepository) => IApiBuilder
  build: () => any
}
