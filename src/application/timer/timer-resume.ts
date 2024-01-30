import { type TimerRepository } from '@/domain/timer'

export interface TimerResumeProps {
  userId: string
}

export class TimerResume {
  constructor(private readonly timerRepository: TimerRepository) {}
  async resume(props: TimerResumeProps): Promise<void> {
    const timer = await this.timerRepository.getTimerByUserId(props.userId)
    timer.resume()
    await this.timerRepository.transaction(async () => {
      await this.timerRepository.update(timer)
    })
  }
}
