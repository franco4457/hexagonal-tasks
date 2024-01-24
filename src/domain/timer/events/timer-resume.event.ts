import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TimerResumeEvent extends DomainEvent {
  userId: string
  duration: number
  staredAt: number
  stoppedAt: number

  constructor(props: DomainEventProps<TimerResumeEvent>) {
    super(props)
    this.userId = props.userId
    this.duration = props.duration
    this.staredAt = props.staredAt
    this.stoppedAt = props.stoppedAt
  }
}
