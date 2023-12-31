import { type Repositories, type EventHandler } from '@/domain/core/ddd/domain-event-handler.base'
import { TaskCreateEvent } from '@/domain/task/events'
import { UserNotFound, type UserRepository } from '@/domain/user'

export class AssignTaskWhenIsCreatedEventHandler implements EventHandler {
  static EVENT_NAME = TaskCreateEvent.name
  static repositoriesToInject: Repositories[] = ['userRepository' as Repositories]
  constructor(protected readonly userRepository: UserRepository) {}

  async handle(event: TaskCreateEvent): Promise<void> {
    const user = await this.userRepository.getById(event.userId)
    if (user == null) throw new UserNotFound(event.userId)
  }
}
