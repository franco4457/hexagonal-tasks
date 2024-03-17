import { Command, type CommandProps } from '@domain/core'

export class UserLoginCommand extends Command {
  readonly email: string
  readonly password: string
  constructor(props: CommandProps<UserLoginCommand>) {
    super(props)
    this.email = props.email
    this.password = props.password
  }
}
