import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskCreateEvent extends DomainEvent {
  readonly title: string
  readonly userId: string
  constructor(props: DomainEventProps<TaskCreateEvent>) {
    super(props)
    this.title = props.title
    this.userId = props.userId
  }
}
