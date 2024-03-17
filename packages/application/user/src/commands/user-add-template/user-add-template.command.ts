import { Command, type CommandProps } from '@domain/core'
import { type TaskTemplateProps } from '@domain/user'

export class UserAddTemplateCommand extends Command {
  readonly userId: string
  readonly template: {
    name: string
    tasks: TaskTemplateProps[]
  }

  constructor(props: CommandProps<UserAddTemplateCommand>) {
    super(props)
    this.userId = props.userId
    this.template = props.template
  }
}
