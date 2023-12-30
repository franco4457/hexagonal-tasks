import type { LoggerPort } from '../logger.port'
import type { DomainEvent } from './domain-event.base'
import type { EventEmitter2 } from 'eventemitter2'
import { Entity } from './entity.base'

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
  }

  public clearEvents(): void {
    this._domainEvents = []
  }

  public async publishEvents(eventEmitter: EventEmitter2, logger: LoggerPort): Promise<void> {
    await Promise.all(
      this.domainEvents.map(async (event) => {
        logger.debug(
          `"${event.constructor.name}" event published for aggregate ${this.constructor.name} : ${this.id}`
        )
        return await eventEmitter.emitAsync(event.constructor.name, event)
      })
    )
    this.clearEvents()
  }
}
