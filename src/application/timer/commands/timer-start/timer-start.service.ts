import type { ICommandHandler } from '@/domain/core'
import type { TimerRepository } from '@/domain/timer'
import type { TimerStartCommand } from './timer-start.command'

export class TimerStartService implements ICommandHandler<TimerStartCommand, void> {
  constructor(private readonly timerRepository: TimerRepository) {}
  async execute(command: TimerStartCommand): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(command.userId)
    timer.start()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
