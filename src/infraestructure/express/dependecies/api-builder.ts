import { ApiExpress } from '../api'
import { asClass, asValue, createContainer } from 'awilix'
import { eventsHandlers } from './events-handlers'
import { MainRouter } from '../routes'
import { ProjectRepository } from '@/domain/project'
import { TaskRepository } from '@/domain/task'
import { TimerRepository } from '@/domain/timer'
import { UserRepository } from '@/domain/user'
import EventEmitter2 from 'eventemitter2'
import type { IApiBuilder } from '@/application/api/builder'

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

  setTimerRepository(timerRepository: TimerRepository): IApiBuilder {
    this.container.register({
      timerRepository: asValue(timerRepository)
    })
    return this
  }

  setProjectRepository(projectRepository: ProjectRepository): IApiBuilder {
    this.container.register({
      projectRepository: asValue(projectRepository)
    })
    return this
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
    if (!(this.container.resolve('timerRepository') instanceof TimerRepository)) {
      throw new Error('TimerRepository not set')
    }
    if (!(this.container.resolve('projectRepository') instanceof ProjectRepository)) {
      throw new Error('ProjectRepository not set')
    }

    eventsHandlers.forEach((handler) => {
      const instance = this.container
        .register({
          [handler.name]: asClass(handler).singleton()
        })
        .resolve(handler.name)
      this.container
        .resolve('eventEmitter')
        .on((handler as any).EVENT_NAME, instance.handle.bind(instance))
    })

    this.api.build(
      new MainRouter(
        this.container.resolve('userRepository'),
        this.container.resolve('taskRepository'),
        this.container.resolve('timerRepository'),
        this.container.resolve('projectRepository')
      )
    )
    return this.api
  }
}
