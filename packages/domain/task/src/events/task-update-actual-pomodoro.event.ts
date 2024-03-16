import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskUpdateActualPomodoroEvent extends DomainEvent {
  estimated: number
  actual: number
  userId: string
  projectName: string | null
  constructor(props: DomainEventProps<TaskUpdateActualPomodoroEvent>) {
    super(props)
    this.estimated = props.estimated
    this.actual = props.actual
    this.userId = props.userId
    this.projectName = props.projectName ?? null
  }
}
