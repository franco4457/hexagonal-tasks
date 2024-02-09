import { Command, type CommandProps } from '@/domain/core'
import { type TaskTemplateProps } from '@/domain/user'

export class UserUpdateTemplateCommand extends Command {
  readonly userId: string
  readonly templateId: string
  readonly newProps: {
    name: string
    tasks: TaskTemplateProps[]
  }

  constructor(props: CommandProps<UserUpdateTemplateCommand>) {
    super(props)
    this.userId = props.userId
    this.templateId = props.templateId
    this.newProps = props.newProps
  }
}
