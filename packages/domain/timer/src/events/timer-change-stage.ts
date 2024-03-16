import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TimerChangeStageEvent extends DomainEvent {
  userId: string
  oldStage: string
  newStage: string
  constructor(props: DomainEventProps<TimerChangeStageEvent>) {
    super(props)
    this.userId = props.userId
    this.oldStage = props.oldStage
    this.newStage = props.newStage
  }
}
