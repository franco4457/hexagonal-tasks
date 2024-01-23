import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TimerStartEvent extends DomainEvent {
  userId: string
  duration: number
  staredAt: number

  constructor(props: DomainEventProps<TimerStartEvent>) {
    super(props)
    this.userId = props.userId
    this.duration = props.duration
    this.staredAt = props.staredAt
  }
}
