import type { IApiBuilder } from '@/application/api/builder'
import { TaskRepository } from '@/domain/task'
import { UserRepository } from '@/domain/user'
import { ApiExpress } from '../api'
import { MainRouter } from '../routes'
import EventEmitter2 from 'eventemitter2'
import { AssignTaskWhenIsCreatedEventHandler } from '@/application/user'
import { asClass, asValue, createContainer } from 'awilix'

const eventhandlers = [AssignTaskWhenIsCreatedEventHandler]

class EventEmitter extends EventEmitter2 {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super()
  }
}

export class ApiBuilderExpress implements IApiBuilder {
  private api: ApiExpress
  private readonly appContext = 'EXPRESS'
  private readonly container = createContainer()

  constructor() {
    this.container.register({
      eventEmitter: asClass(EventEmitter).singleton(),
      appContext: asValue(this.appContext)
    })
    this.api = new ApiExpress()
  }

  getRepoConfig(): { eventEmitter: EventEmitter2; appContext?: string } {
    return {
      eventEmitter: this.container.resolve('eventEmitter'),
      appContext: this.appContext
    }
  }

  reset(): IApiBuilder {
    this.api = new ApiExpress()
    return this
  }

  setTaskRepository(taskRepository: TaskRepository): IApiBuilder {
    this.container.register({
      taskRepository: asValue(taskRepository)
    })
    return this
  }

  setUserRepository(userRepository: UserRepository): IApiBuilder {
    this.container.register({
      userRepository: asValue(userRepository)
    })
    return this
  }

  build(): ApiExpress {
    if (!(this.container.resolve('taskRepository') instanceof TaskRepository)) {
      throw new Error('TaskRepository not set')
    }
    if (!(this.container.resolve('userRepository') instanceof UserRepository)) {
      throw new Error('UserRepository not set')
    }

    eventhandlers.forEach((Handler) => {
      const instance = this.container
        .register({
          [Handler.name]: asClass(Handler).singleton()
        })
        .resolve(Handler.name)
      this.container.resolve('eventEmitter').on(Handler.EVENT_NAME, instance.handle.bind(instance))
    })

    this.api.build(
      new MainRouter(
        this.container.resolve('userRepository'),
        this.container.resolve('taskRepository')
      )
    )
    return this.api
  }
}
