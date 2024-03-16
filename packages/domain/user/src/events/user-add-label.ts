import { DomainEvent, type DomainEventProps } from '@domain/core'

export class UserAddLabelEvent extends DomainEvent {
  labelName: string
  labelId: string
  constructor(props: DomainEventProps<UserAddLabelEvent>) {
    super(props)
    this.labelName = props.labelName
    this.labelId = props.labelId
  }
}
