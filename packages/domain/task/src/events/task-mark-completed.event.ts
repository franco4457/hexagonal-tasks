import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskMarkCompleted extends DomainEvent {
  userId: string
  constructor(props: DomainEventProps<TaskMarkCompleted>) {
    super(props)
    this.userId = props.userId
  }
}
