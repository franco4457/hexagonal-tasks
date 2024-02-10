import { Command, type CommandProps } from '@/domain/core'

export class TimerStopCommand extends Command {
  readonly userId: string
  constructor(props: CommandProps<TimerStopCommand>) {
    super(props)
    this.userId = props.userId
  }
}
