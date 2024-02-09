import { Command, type CommandProps } from '@/domain/core'

export class TaskRemoveLabelCommand extends Command {
  readonly taskId: string
  readonly labelName: string

  constructor(props: CommandProps<TaskRemoveLabelCommand>) {
    super(props)
    this.taskId = props.taskId
    this.labelName = props.labelName
  }
}
