import { Command, type CommandProps } from '@domain/core'

export class UserAddLabelCommand extends Command {
  readonly userId: string
  readonly label: { name: string }
  constructor(props: CommandProps<UserAddLabelCommand>) {
    super(props)
    this.userId = props.userId
    this.label = props.label
  }
}
