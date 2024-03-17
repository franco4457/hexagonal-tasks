import { type Repositories, type EventHandler } from '@domain/core'
import { TaskCreateEvent } from '@domain/task'
import { UserNotFound, type UserRepository } from '@domain/user'

export class AssignTaskWhenIsCreatedEventHandler implements EventHandler {
  static EVENT_NAME = TaskCreateEvent.name
  static repositoriesToInject: Repositories[] = ['userRepository' as Repositories]
  private readonly userRepository: UserRepository
  constructor(props: { userRepository: UserRepository }) {
    this.userRepository = props.userRepository
  }

  async handle(event: TaskCreateEvent): Promise<void> {
    const user = await this.userRepository.getById(event.userId)
    if (user == null) throw new UserNotFound(event.userId)
  }
}
