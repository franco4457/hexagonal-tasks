import type { IApiBuilder } from '@/application/api/builder'
import type { TaskRepository } from '@/domain/task'
import type { IUserRepository } from '@/domain/user'
import { ApiExpress } from '../api'
import { MainRouter } from '../routes'

export class ApiBuilderExpress implements IApiBuilder {
  private api: ApiExpress
  private taskRepository!: TaskRepository | null
  private userRepository!: IUserRepository | null
  constructor() {
    this.taskRepository = null
    this.userRepository = null
    this.api = new ApiExpress()
  }

  reset(): IApiBuilder {
    this.taskRepository = null
    this.userRepository = null
    this.api = new ApiExpress()
    return this
  }

  setTaskRepository(taskRepository: TaskRepository): IApiBuilder {
    this.taskRepository = taskRepository
    return this
  }

  setUserRepository(userRepository: IUserRepository): IApiBuilder {
    this.userRepository = userRepository
    return this
  }

  build(): ApiExpress {
    if (this.taskRepository == null) throw new Error('TaskRepository not set')
    if (this.userRepository == null) throw new Error('UserRepository not set')

    this.api.build(new MainRouter(this.userRepository, this.taskRepository))
    return this.api
  }
}
