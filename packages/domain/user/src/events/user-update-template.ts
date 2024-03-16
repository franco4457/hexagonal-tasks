import { DomainEvent, type DomainEventProps } from '@domain/core'

export class UserUpdateTemplateEvent extends DomainEvent {
  templateId: string
  name: string
  constructor(props: DomainEventProps<UserUpdateTemplateEvent>) {
    super(props)
    this.templateId = props.templateId
    this.name = props.name
  }
}
