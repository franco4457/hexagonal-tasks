import { DomainEvent, type DomainEventProps } from '@domain/core'

export class UserRemoveTemplateEvent extends DomainEvent {
  templateId: string
  templateName: string
  constructor(props: DomainEventProps<UserRemoveTemplateEvent>) {
    super(props)
    this.templateId = props.templateId
    this.templateName = props.templateName
  }
}
