import { Command, type CommandProps } from '@/domain/core'

export class TaskRemoveProjectCommand extends Command {
  readonly taskId: string

  constructor(props: CommandProps<TaskRemoveProjectCommand>) {
    super(props)
    this.taskId = props.taskId
  }
}
