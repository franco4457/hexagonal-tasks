import { ValidationError } from '@/domain/core'
import { type TimerRepository } from '@/domain/timer'

export interface TimerChangeStageProps {
  timerId: string
  stage: 'pomodoro' | 'shortBreak' | 'longBreak'
}

// XXX: check if it's better to use a factory call for changeStage method
export class TimerChangeStage {
  constructor(private readonly timerRepository: TimerRepository) {}
  async change({ timerId, stage }: TimerChangeStageProps): Promise<void> {
    const timer = await this.timerRepository.getTimer(timerId)

    if (stage === 'pomodoro') {
      timer.changeToPomodoroStage()
    } else if (stage === 'shortBreak') {
      timer.changeToShortBreakStage()
    } else if (stage === 'longBreak') {
      timer.changeToLongBreakStage()
    } else {
      throw new ValidationError(
        `Stage '${
          stage as string
        }' is not valid. Permitted stages are: 'pomodoro', 'shortBreak', 'longBreak'.`
      )
    }
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
