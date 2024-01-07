import type { IApiBuilder } from '@/application/api/builder'
import type { TaskRepository } from '@/domain/task'
import { type UserRepository } from '@/domain/user'
import { ApiExpress } from '../api'
import { MainRouter } from '../routes'
import EventEmitter2 from 'eventemitter2'
import { AssignTaskWhenIsCreatedEventHandler } from '@/application/user'

const eventhandlers = [AssignTaskWhenIsCreatedEventHandler]
export class ApiBuilderExpress implements IApiBuilder {
  private api: ApiExpress
  private taskRepository!: TaskRepository | null
  private userRepository!: UserRepository | null
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

  setUserRepository(userRepository: UserRepository): IApiBuilder {
    this.userRepository = userRepository
    return this
  }

  build(): ApiExpress {
    if (this.taskRepository == null) throw new Error('TaskRepository not set')
    if (this.userRepository == null) throw new Error('UserRepository not set')
    eventhandlers.forEach((Handler) => {
      const repositoriesToInject = Handler.repositoriesToInject.map((repo) => {
        return this[repo]
      })
      const instance = new Handler(...(repositoriesToInject as [UserRepository])) // Convert repositoriesToInject to a tuple
      this.eventEmitter.on(Handler.EVENT_NAME, instance.handle.bind(instance))
    })

    this.api.build(new MainRouter(this.userRepository, this.taskRepository))
    return this.api
  }
}
