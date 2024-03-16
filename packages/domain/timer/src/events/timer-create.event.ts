import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TimerCreateEvent extends DomainEvent {
  userId: string
  constructor(props: DomainEventProps<TimerCreateEvent>) {
    super(props)
    this.userId = props.userId
  }
}
