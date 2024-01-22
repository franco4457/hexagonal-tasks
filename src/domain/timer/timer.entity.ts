import { randomUUID } from 'crypto'
import { type AggregateID, AggregateRoot } from '@/domain/core'
import { type Status } from './value-objects'
import { TimerCreateEvent } from './events/timer-create.event'

export interface TimerProps {
  userId: AggregateID
  currentTaskId: AggregateID | null
  status: Status
  fullDuration: number
  startedAt: number
  currentDuration: number
}

export interface TimerCreateProps {
  userId: AggregateID
  fullDuration?: number
  status: Status
}

export class Timer extends AggregateRoot<TimerProps> {
  public static create(props: TimerCreateProps): Timer {
    const id = randomUUID()
    const timer = new Timer({
      props: {
        userId: props.userId,
        currentTaskId: null,
        status: props.status,
        fullDuration: props.fullDuration ?? 25 * 60 * 1000,
        startedAt: 0,
        currentDuration: 0
      },
      id
    })
    timer.addEvent(
      new TimerCreateEvent({
        aggregateId: id,
        userId: timer.props.userId,
        fullDuration: timer.props.fullDuration
      })
    )
    return timer
  }

  validate(): void {
    throw new Error('Method not implemented.')
  }
}
