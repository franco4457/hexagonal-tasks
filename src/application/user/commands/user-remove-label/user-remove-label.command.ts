import { Command, type CommandProps } from '@/domain/core'

export class UserRemoveLabelCommand extends Command {
  readonly userId: string
  readonly labelId: string
  constructor(props: CommandProps<UserRemoveLabelCommand>) {
    super(props)
    this.userId = props.userId
    this.labelId = props.labelId
  }
}
