import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskRemoveProjectEvent extends DomainEvent {
  userId: string
  constructor(props: DomainEventProps<TaskRemoveProjectEvent>) {
    super(props)
    this.userId = props.userId
  }
}
