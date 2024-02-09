import { Command, type CommandProps } from '@/domain/core'

export class LoginUserCommand extends Command {
  readonly email: string
  readonly password: string
  constructor(props: CommandProps<LoginUserCommand>) {
    super(props)
    this.email = props.email
    this.password = props.password
  }
}
