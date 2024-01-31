import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class ProjectSumPomodoroCountEvent extends DomainEvent {
  actCounter: number
  constructor(props: DomainEventProps<ProjectSumPomodoroCountEvent>) {
    super(props)
    this.actCounter = props.actCounter
  }
}
