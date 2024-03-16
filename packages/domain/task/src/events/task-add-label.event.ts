import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskAddLabelEvent extends DomainEvent {
  labelName: string
  userId: string
  constructor(props: DomainEventProps<TaskAddLabelEvent>) {
    super(props)
    this.labelName = props.labelName
    this.userId = props.userId
  }
}
