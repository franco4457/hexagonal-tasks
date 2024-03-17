import { Command, type CommandProps } from '@domain/core'

export class UserRemoveTemplateCommand extends Command {
  readonly userId: string
  readonly templateId: string
  constructor(props: CommandProps<UserRemoveTemplateCommand>) {
    super(props)
    this.userId = props.userId
    this.templateId = props.templateId
  }
}
