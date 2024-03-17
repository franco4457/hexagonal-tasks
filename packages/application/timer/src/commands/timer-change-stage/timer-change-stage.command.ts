import { Command, type CommandProps } from '@domain/core'

export class TimerChangeStageCommand extends Command {
  readonly timerId: string
  readonly stage: 'pomodoro' | 'shortBreak' | 'longBreak'
  constructor(props: CommandProps<TimerChangeStageCommand>) {
    super(props)
    this.timerId = props.timerId
    this.stage = props.stage
  }
}
