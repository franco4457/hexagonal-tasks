import { type ICommandHandler } from '@/domain/core'
import { InvalidStage, type TimerRepository } from '@/domain/timer'
import { type TimerChangeStageCommand } from './timer-change-stage.command'

// XXX: check if it's better to use a factory call for changeStage method
export class TimerChangeStageService implements ICommandHandler<TimerChangeStageCommand, void> {
  constructor(private readonly timerRepository: TimerRepository) {}
  async execute({ timerId, stage }: TimerChangeStageCommand): Promise<void> {
    const timer = await this.timerRepository.getTimer(timerId)

    if (stage === 'pomodoro') {
      timer.changeToPomodoroStage()
    } else if (stage === 'shortBreak') {
      timer.changeToShortBreakStage()
    } else if (stage === 'longBreak') {
      timer.changeToLongBreakStage()
    } else {
      throw new InvalidStage(
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
