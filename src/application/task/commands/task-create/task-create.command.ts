import { Command, type CommandProps } from '@/domain/core'
import { type TaskPropsCreate } from '@/domain/task'

export class TaskCreateCommand extends Command {
  readonly userId: string
  readonly task: Omit<TaskPropsCreate, 'userId' | 'pomodoro' | 'project' | 'labels'> & {
    pomodoro: {
      estimated: number
    }
    labels: Array<{ name: string; id?: string }>
    project?: { name: string; id?: string } | null
  }

  constructor(props: CommandProps<TaskCreateCommand>) {
    super(props)
    this.userId = props.userId
    this.task = props.task
  }
}
