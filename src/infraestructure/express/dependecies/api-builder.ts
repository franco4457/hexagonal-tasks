import type { IApiBuilder } from '@/application/api/builder'
import type { TaskRepository } from '@/domain/task'
import type { IUserRepository } from '@/domain/user'
import { ApiExpress } from '../api'
import { MainRouter } from '../routes'
import EventEmitter2 from 'eventemitter2'
export class ApiBuilderExpress implements IApiBuilder {
  private api: ApiExpress
  private taskRepository!: TaskRepository | null
  private userRepository!: IUserRepository | null
  private readonly eventEmitter = new EventEmitter2()
  private readonly appContext = 'EXPRESS'
  constructor() {
    this.taskRepository = null
    this.userRepository = null
    this.api = new ApiExpress()
  }

  getRepoConfig(): { eventEmitter: EventEmitter2; appContext?: string } {
    return {
      eventEmitter: this.eventEmitter,
      appContext: this.appContext
    }
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
