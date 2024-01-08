import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskUpdateActualPomodoroEvent extends DomainEvent {
  estimated: number
  actual: number
  constructor(props: DomainEventProps<TaskUpdateActualPomodoroEvent>) {
    super(props)
    this.estimated = props.estimated
    this.actual = props.actual
  }
}
