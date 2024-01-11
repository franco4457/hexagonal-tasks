import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskAddLabelEvent extends DomainEvent {
  labelId: string
  userId: string
  constructor(props: DomainEventProps<TaskAddLabelEvent>) {
    super(props)
    this.labelId = props.labelId
    this.userId = props.userId
  }
}
