import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class TaskUpdateProyectEvent extends DomainEvent {
  userId: string
  proyectName: string
  proyectId: string
  constructor(props: DomainEventProps<TaskUpdateProyectEvent>) {
    super(props)
    this.userId = props.userId
    this.proyectName = props.proyectName
    this.proyectId = props.proyectId
  }
}
