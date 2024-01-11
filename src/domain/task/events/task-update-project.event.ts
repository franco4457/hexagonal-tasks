import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskUpdateProjectEvent extends DomainEvent {
  userId: string
  projectName: string
  projectId: string
  constructor(props: DomainEventProps<TaskUpdateProjectEvent>) {
    super(props)
    this.userId = props.userId
    this.projectName = props.projectName
    this.projectId = props.projectId
  }
}
