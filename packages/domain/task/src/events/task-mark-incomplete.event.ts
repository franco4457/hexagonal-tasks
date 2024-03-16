import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskMarkIncompleted extends DomainEvent {
  userId: string
  constructor(props: DomainEventProps<TaskMarkIncompleted>) {
    super(props)
    this.userId = props.userId
  }
}
