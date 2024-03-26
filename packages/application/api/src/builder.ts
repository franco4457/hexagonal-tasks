import type { EventBus } from '@domain/core'
import type { ProjectRepository } from '@domain/project'
import type { TaskRepository } from '@domain/task'
import type { TimerRepository } from '@domain/timer'
import type { UserRepository } from '@domain/user'

export interface IApiBuilder {
  reset: () => IApiBuilder
  getRepoConfig: () => {
    eventBus: EventBus
    appContext?: string
  }
  setProjectRepository: (projectRepository: ProjectRepository) => IApiBuilder
  setTimerRepository: (timerRepository: TimerRepository) => IApiBuilder
  setTaskRepository: (taskRepository: TaskRepository) => IApiBuilder
  setUserRepository: (userRepository: UserRepository) => IApiBuilder
  build: () => any
}
