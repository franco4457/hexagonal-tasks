import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TimerResumeEvent extends DomainEvent {
  userId: string
  duration: number
  startedAt: number
  stoppedAt: number

  constructor(props: DomainEventProps<TimerResumeEvent>) {
    super(props)
    this.userId = props.userId
    this.duration = props.duration
    this.startedAt = props.startedAt
    this.stoppedAt = props.stoppedAt
  }
}
