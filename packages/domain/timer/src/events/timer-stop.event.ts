import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TimerStopEvent extends DomainEvent {
  userId: string
  stage: string
  stoppedAt: number

  constructor(props: DomainEventProps<TimerStopEvent>) {
    super(props)
    this.userId = props.userId
    this.stage = props.stage
    this.stoppedAt = props.stoppedAt
  }
}
