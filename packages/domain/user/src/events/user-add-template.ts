import { DomainEvent, type DomainEventProps } from '@domain/core'

export class UserAddTemplateEvent extends DomainEvent {
  name: string
  templateId: string
  constructor(props: DomainEventProps<UserAddTemplateEvent>) {
    super(props)
    this.name = props.name
    this.templateId = props.templateId
  }
}
