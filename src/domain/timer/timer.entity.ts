import { randomUUID } from 'crypto'
import { type AggregateID, AggregateRoot, isEmpty, ValidationError } from '@/domain/core'
import { StatusEnum, Status } from './value-objects'
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
}

export class Timer extends AggregateRoot<TimerProps> {
  public static create(props: TimerCreateProps): Timer {
    const id = randomUUID()
    const timer = new Timer({
      props: {
        userId: props.userId,
        currentTaskId: null,
        status: new Status(StatusEnum.READY),
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
    const { userId, status, currentDuration, fullDuration, startedAt } = this.props
    if (isEmpty(userId)) {
      throw new ValidationError('Timer must have a userId.')
    }
    if (!(status instanceof Status)) {
      throw new ValidationError('Timer must have a status.')
    }
    if (isEmpty(fullDuration)) {
      throw new ValidationError('Timer must have a currentDuration.')
    }
    if (isEmpty(startedAt)) {
      throw new ValidationError('Timer must have a startedAt.')
    }
    if (isEmpty(currentDuration)) {
      throw new ValidationError('Timer must have a currentDuration.')
    }
  }
}
