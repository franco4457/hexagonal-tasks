import { Command, type CommandProps } from '@/domain/core'

export class TaskAddLabelCommand extends Command {
  readonly taskId: string
  readonly label: Array<{ name: string }>

  constructor(props: CommandProps<TaskAddLabelCommand>) {
    super(props)
    this.taskId = props.taskId
    this.label = props.label
  }
}
