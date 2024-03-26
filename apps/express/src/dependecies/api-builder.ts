import { ApiExpress } from '../api'
import { asClass, asValue, createContainer } from 'awilix'
import { eventsHandlers } from './events-handlers'
import { MainRouter } from '../routes'
import { type ProjectRepository } from '@domain/project'
import { type TaskRepository } from '@domain/task'
import { type TimerRepository } from '@domain/timer'
import { type UserRepository } from '@domain/user'
import type { IApiBuilder } from '@application/api'
import { InMemoryEventBus } from '@infrastructure/event-bus-in-memory'
import { type EventHandler, type EventBus } from '@domain/core'

export class ApiBuilderExpress implements IApiBuilder {
  private api: ApiExpress
  private readonly appContext = 'EXPRESS'
  private readonly container = createContainer()

  constructor() {
    this.container.register({
      eventBus: asClass(InMemoryEventBus).singleton(),
      appContext: asValue(this.appContext)
    })
    this.api = new ApiExpress()
  }

  getRepoConfig(): { eventBus: EventBus; appContext?: string } {
    return {
      eventBus: this.container.resolve('eventBus'),
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
    if (this.container.resolve('taskRepository').repositoryName !== 'TaskRepository') {
      throw new Error('TaskRepository not set')
    }
    if (this.container.resolve('userRepository').repositoryName !== 'UserRepository') {
      throw new Error('UserRepository not set')
    }
    if (this.container.resolve('timerRepository').repositoryName !== 'TimerRepository') {
      throw new Error('TimerRepository not set')
    }
    if (this.container.resolve('projectRepository').repositoryName !== 'ProjectRepository') {
      throw new Error('ProjectRepository not set')
    }
    const eventBus = this.container.resolve('eventBus') as EventBus
    eventsHandlers.forEach((handler) => {
      const instance: EventHandler = this.container
        .register({
          [handler.name]: asClass(handler).singleton()
        })
        .resolve(handler.name)
      eventBus.subscribe(instance)
    })

    this.api.build(
      new MainRouter(
        this.container.resolve('userRepository') as UserRepository,
        this.container.resolve('taskRepository') as TaskRepository,
        this.container.resolve('timerRepository') as TimerRepository,
        this.container.resolve('projectRepository') as ProjectRepository
      )
    )
    return this.api
  }
}
