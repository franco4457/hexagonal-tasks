import { type TimerRepository } from '@/domain/timer'

export interface TimerFinishProps {
  userId: string
}

export class TimerFinish {
  constructor(private readonly timerRepository: TimerRepository) {}
  async finish(props: TimerFinishProps): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(props.userId)
    timer.finish()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
