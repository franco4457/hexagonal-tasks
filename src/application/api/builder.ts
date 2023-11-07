import { type TaskRepository } from '@/domain/task'
import { type IUserRepository } from '@/domain/user'

export interface IApiBuilder {
  reset: () => IApiBuilder
  setTaskRepository: (taskRepository: TaskRepository) => IApiBuilder
  setUserRepository: (userRepository: IUserRepository) => IApiBuilder
  build: () => any
}
