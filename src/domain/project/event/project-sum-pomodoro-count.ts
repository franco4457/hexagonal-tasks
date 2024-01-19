import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskSumPomodoroCountEvent extends DomainEvent {
  actCounter: number
  constructor(props: DomainEventProps<TaskSumPomodoroCountEvent>) {
    super(props)
    this.actCounter = props.actCounter
  }
}
