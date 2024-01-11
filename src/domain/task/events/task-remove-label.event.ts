import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskRemoveLabelEvent extends DomainEvent {
  labelId: string
  userId: string
  constructor(props: DomainEventProps<TaskRemoveLabelEvent>) {
    super(props)
    this.labelId = props.labelId
    this.userId = props.userId
  }
}
