import { type DomainEvent, EventBus, type EventHandler } from '@domain/core'
import EventEmitter2 from 'eventemitter2'

export class InMemoryEventBus extends EventBus {
  private readonly eventEmitter = new EventEmitter2()
  async publish(event: DomainEvent): Promise<void> {
    await this.eventEmitter.emitAsync(event.constructor.name, event)
  }

  subscribe(handler: EventHandler): void {
    this.eventEmitter.on(handler.EVENT_NAME, handler.handle.bind(handler))
  }
}
