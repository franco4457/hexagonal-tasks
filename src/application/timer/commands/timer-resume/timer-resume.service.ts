import { type ICommandHandler } from './../../../../domain/core/ddd/command.base'
import { type TimerRepository } from '@/domain/timer'
import { type TimerResumeCommand } from './timer-resume.command'

export class TimerResumeService implements ICommandHandler<TimerResumeCommand, void> {
  constructor(private readonly timerRepository: TimerRepository) {}
  async execute(command: TimerResumeCommand): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(command.userId)
    timer.resume()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
