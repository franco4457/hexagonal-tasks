import { type IQueryHandler, QueryBase } from '@domain/core'
import { type TimerRepository, type Timer } from '@domain/timer'

export class TimerByUserIdQuery extends QueryBase {
  readonly userId: string
  constructor(props: { userId: string }) {
    super()
    this.userId = props.userId
  }
}

export class TimerByUserIdQueryHandler implements IQueryHandler<TimerByUserIdQuery, Timer> {
  constructor(private readonly timerRepository: TimerRepository) {}
  async execute(query: TimerByUserIdQuery): Promise<Timer> {
    return await this.timerRepository.getTimerByUserId(query.userId)
  }
}
