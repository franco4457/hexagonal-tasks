import { ValueObject } from '@/domain/core'

export interface PomodoroProps {
  estimated: number
  actual: number
}
// TODO: add events to pomodoro
export class Pomodoro extends ValueObject<PomodoroProps> {
  static create(props: PomodoroProps): Pomodoro {
    return new Pomodoro(props)
  }

  // TODO: add custom Errors
  protected validate(props: PomodoroProps): void {
    if (props.estimated < 0) {
      throw new Error('Estimated should be greater than 0')
    }
    if (props.actual < 0) {
      throw new Error('Actual should be greater than 0')
    }
    if (props.actual > props.estimated) {
      throw new Error('Actual should be less than estimated')
    }
  }
}
