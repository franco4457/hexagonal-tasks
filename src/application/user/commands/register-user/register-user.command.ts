import { Command, type CommandProps } from '@/domain/core'

export class RegisterUserCommand extends Command {
  readonly name: string
  readonly lastname: string
  readonly username: string
  readonly email: string
  readonly password: string

  constructor(props: CommandProps<RegisterUserCommand>) {
    super(props)
    this.email = props.email
    this.lastname = props.lastname
    this.username = props.username
    this.name = props.name
    this.password = props.password
  }
}
