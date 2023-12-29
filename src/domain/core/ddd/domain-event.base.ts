import { randomUUID } from 'crypto'

interface DomainEventMetadata {
  readonly timestamp: number
  readonly correlationId: string
  readonly causationId?: string
  readonly userId?: string
}

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  aggregateId: string
  metadata?: DomainEventMetadata
}

export abstract class DomainEvent {
  public readonly id: string
  public readonly aggregateId: string
  public readonly metadata: DomainEventMetadata

  protected constructor(props: DomainEventProps<unknown>) {
    this.id = randomUUID()
    this.aggregateId = props.aggregateId
    this.metadata = {
      // TODO: implement interceptor to get correlationId from request
      correlationId: props.metadata?.correlationId ?? randomUUID(),
      timestamp: props.metadata?.timestamp ?? Date.now(),
      causationId: props.metadata?.causationId,
      userId: props.metadata?.userId
    }
  }
}
