import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskRemoveLabelEvent extends DomainEvent {
  labelName: string
  userId: string
  constructor(props: DomainEventProps<TaskRemoveLabelEvent>) {
    super(props)
    this.labelName = props.labelName
    this.userId = props.userId
  }
}
