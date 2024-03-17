import { Command, type CommandProps } from '@domain/core'

export class TimerStartCommand extends Command {
  readonly userId: string
  constructor(props: CommandProps<TimerStartCommand>) {
    super(props)
    this.userId = props.userId
  }
}
