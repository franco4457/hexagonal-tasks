import { calculateMsFromMins, ValidationError, ValueObject, isEmpty } from '@domain/core'

export interface DurationProps {
  pomodoro: number
  shortBreak: number
  longBreak: number
}

export class Duration extends ValueObject<DurationProps> {
  static create(props: Partial<DurationProps>): Duration {
    return new Duration({
      pomodoro: props.pomodoro ?? calculateMsFromMins(25),
      shortBreak: props.shortBreak ?? calculateMsFromMins(5),
      longBreak: props.longBreak ?? calculateMsFromMins(15)
    })
  }

  get pomodoro(): number {
    return this.value.pomodoro
  }

  get shortBreak(): number {
    return this.value.shortBreak
  }

  get longBreak(): number {
    return this.value.longBreak
  }

  protected validate(value: DurationProps): void {
    if (isEmpty(value)) {
      throw new ValidationError('Duration must be defined')
    }
    if (value.pomodoro < 0) {
      throw new ValidationError('Pomodoro duration must be greater than 0')
    }
    if (value.shortBreak < 0) {
      throw new ValidationError('Short break duration must be greater than 0')
    }
    if (value.longBreak < 0) {
      throw new ValidationError('Long break duration must be greater than 0')
    }
  }
}
