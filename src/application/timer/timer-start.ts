import { type TimerRepository } from '@/domain/timer'

export interface TimerStarProps {
  userId: string
}

export class TimerStar {
  constructor(private readonly timerRepository: TimerRepository) {}
  async start(props: TimerStarProps): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(props.userId)
    timer.start()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
