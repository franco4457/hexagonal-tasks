import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskUpdateEstimatedPomodoroEvent extends DomainEvent {
  estimated: number
  actual: number
  constructor(props: DomainEventProps<TaskUpdateEstimatedPomodoroEvent>) {
    super(props)
    this.estimated = props.estimated
    this.actual = props.actual
  }
}
