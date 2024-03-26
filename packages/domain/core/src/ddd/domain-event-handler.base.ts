import { type DomainEvent } from './domain-event.base'

export type Repositories =
  | 'userRepository'
  | 'taskRepository'
  | 'projectRepository'
  | 'timerRepository'

export abstract class EventHandler {
  abstract EVENT_NAME: string
  static repositoriesToInject: Repositories[]
  abstract handle(event: DomainEvent): Promise<void>
}
