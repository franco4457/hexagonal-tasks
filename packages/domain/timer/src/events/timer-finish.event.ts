import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TimerFinishEvent extends DomainEvent {
  userId: string
  currentTaskId: string | null
  pomodoroCounter: number
  prevStage: string
  nextStage: string
  constructor(props: DomainEventProps<TimerFinishEvent>) {
    super(props)
    this.userId = props.userId
    this.currentTaskId = props.currentTaskId
    this.pomodoroCounter = props.pomodoroCounter
    this.prevStage = props.prevStage
    this.nextStage = props.nextStage
  }
}
