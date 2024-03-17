import { Command, type CommandProps } from '@domain/core'

export class TaskSetProjectCommand extends Command {
  readonly taskId: string
  readonly project: { name: string }

  constructor(props: CommandProps<TaskSetProjectCommand>) {
    super(props)
    this.taskId = props.taskId
    this.project = props.project
  }
}
