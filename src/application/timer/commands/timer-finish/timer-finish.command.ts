import { Command, type CommandProps } from '@/domain/core'

export class TimerFinishCommand extends Command {
  readonly userId: string
  constructor(props: CommandProps<TimerFinishCommand>) {
    super(props)
    this.userId = props.userId
  }
}
