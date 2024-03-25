import { type EventHandler } from './domain-event-handler.base'
import { type DomainEvent } from './domain-event.base'

export abstract class EventBus {
  abstract publish(event: DomainEvent): Promise<void>
  abstract subscribe(handler: EventHandler): void
}
