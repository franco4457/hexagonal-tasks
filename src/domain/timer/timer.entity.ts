import { randomUUID } from 'crypto'
import { type AggregateID, AggregateRoot, isEmpty, ValidationError } from '@/domain/core'
import {
  StatusEnum,
  Status,
  Duration,
  type DurationProps,
  Stage,
  type StageProps
} from './value-objects'
import { TimerCreateEvent } from './events/timer-create.event'

export interface TimerProps {
  userId: AggregateID
  currentTaskId: AggregateID | null
  status: Status
  duration: Duration
  stage: Stage
  startedAt: number
  currentDuration: number
}

export interface TimerCreateProps {
  userId: AggregateID
  fullDuration?: number
  duration?: Partial<DurationProps>
  stage?: Partial<StageProps>
}

export class Timer extends AggregateRoot<TimerProps> {
  public static create(props: TimerCreateProps): Timer {
    const id = randomUUID()
    const timer = new Timer({
      props: {
        userId: props.userId,
        currentTaskId: null,
        status: new Status(StatusEnum.READY),
        duration: Duration.create(props.duration ?? {}),
        stage: Stage.create(props.stage ?? {}),
        startedAt: 0,
        currentDuration: 0
      },
      id
    })
    timer.addEvent(
      new TimerCreateEvent({
        aggregateId: id,
        userId: timer.props.userId
      })
    )
    return timer
  }

  validate(): void {
    const { userId, status, currentDuration, startedAt, duration } = this.props
    if (isEmpty(userId)) {
      throw new ValidationError('Timer must have a userId.')
    }
    if (!(status instanceof Status)) {
      throw new ValidationError('Timer must have a status.')
    }
    if (isEmpty(startedAt)) {
      throw new ValidationError('Timer must have a startedAt.')
    }
    if (isEmpty(currentDuration)) {
      throw new ValidationError('Timer must have a currentDuration.')
    }
    if (!(duration instanceof Duration)) {
      throw new ValidationError('Timer must have a duration.')
    }
  }
}
