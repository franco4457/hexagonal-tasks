import { DomainEvent, type DomainEventProps } from '@domain/core'

export class TaskSetProjectEvent extends DomainEvent {
  userId: string
  projectName: string
  constructor(props: DomainEventProps<TaskSetProjectEvent>) {
    super(props)
    this.userId = props.userId
    this.projectName = props.projectName
  }
}
