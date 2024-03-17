import { type TimerRepository } from '@domain/timer'
import { type TimerStopCommand } from './timer-stop.command'
import { type ICommandHandler } from '@domain/core'

export class TimerStopService implements ICommandHandler<TimerStopCommand, void> {
  constructor(private readonly timerRepository: TimerRepository) {}
  async execute(command: TimerStopCommand): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(command.userId)
    timer.stop()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
