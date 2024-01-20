import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class UserRemoveLabelEvent extends DomainEvent {
  labelName: string
  labelId: string
  constructor(props: DomainEventProps<UserRemoveLabelEvent>) {
    super(props)
    this.labelName = props.labelName
    this.labelId = props.labelId
  }
}
