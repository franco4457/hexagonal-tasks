import { type ICommandHandler } from '@/domain/core'
import { type TimerRepository } from '@/domain/timer'
import { type TimerFinishCommand } from './timer-finish.command'

export class TimerFinishService implements ICommandHandler<TimerFinishCommand, void> {
  constructor(private readonly timerRepository: TimerRepository) {}
  async execute(command: TimerFinishCommand): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(command.userId)
    timer.finish()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
