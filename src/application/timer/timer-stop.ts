import { type TimerRepository } from '@/domain/timer'

export interface TimerStopProps {
  userId: string
}

export class TimerStop {
  constructor(private readonly timerRepository: TimerRepository) {}
  async stop(props: TimerStopProps): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(props.userId)
    timer.stop()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
