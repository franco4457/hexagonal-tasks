import { ValidationError, ValueObject } from '@/domain/core'

export interface PomodoroProps {
  estimated: number
  actual: number
}
export class Pomodoro extends ValueObject<PomodoroProps> {
  static create(props: PomodoroProps): Pomodoro {
    return new Pomodoro(props)
  }

  protected validate(props: PomodoroProps): void {
    if (props.estimated < 0) {
      throw new ValidationError('Estimated should be greater than 0')
    }
    if (props.actual < 0) {
      throw new ValidationError('Actual should be greater than 0')
    }
    if (props.actual > props.estimated) {
      throw new ValidationError('Actual should be less than estimated')
    }
  }
}
