import { DomainEvent, type DomainEventProps } from '@/domain/core'

export class UserCreateEvent extends DomainEvent {
  readonly email: string

  readonly username: string

  constructor(props: DomainEventProps<UserCreateEvent>) {
    super(props)
    this.email = props.email
    this.username = props.username
  }
}
