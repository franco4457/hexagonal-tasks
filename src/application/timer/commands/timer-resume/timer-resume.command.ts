import { Command, type CommandProps } from '@/domain/core'

export class TimerResumeCommand extends Command {
  readonly userId: string
  constructor(props: CommandProps<TimerResumeCommand>) {
    super(props)
    this.userId = props.userId
  }
}
