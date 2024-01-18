import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class ProjectCreateEvent extends DomainEvent {
  name: string
  userId: string
  constructor(props: DomainEventProps<ProjectCreateEvent>) {
    super(props)
    this.name = props.name
    this.userId = props.userId
  }
}
