import { randomUUID } from 'crypto'
import { type AggregateID, AggregateRoot, isEmpty, ValidationError } from '@/domain/core'
import {
  StatusEnum,
  Status,
  Duration,
  type DurationProps,
  Stage,
  type StageProps,
  StageEnum
} from './value-objects'
import { TimerCreateEvent, TimerStartEvent } from './events'

export interface TimerProps {
  userId: AggregateID
  currentTaskId: AggregateID | null
  status: Status
  duration: Duration
  stage: Stage
  startedAt: number
  pomodoroCounter: number
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
        pomodoroCounter: 0
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

  get currentDuration(): number {
    const stage = this.props.stage.currentStage
    if (stage === StageEnum.SHORT_BREAK) {
      return this.props.duration.shortBreak
    } else if (stage === StageEnum.LONG_BREAK) {
      return this.props.duration.longBreak
    }
    return this.props.duration.pomodoro
  }

  start(): void {
    if (this.props.status.isReady()) {
      throw new Error('Timer is not ready to start.')
    }
    const now = Date.now()
    this.props.status = new Status(StatusEnum.RUNNING)
    this.props.startedAt = now
    this.addEvent(
      new TimerStartEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        duration: this.currentDuration,
        staredAt: now
      })
    )
  }

  validate(): void {
    const { userId, status, startedAt, duration } = this.props
    if (isEmpty(userId)) {
      throw new ValidationError('Timer must have a userId.')
    }
    if (!(status instanceof Status)) {
      throw new ValidationError('Timer must have a status.')
    }
    if (isEmpty(startedAt)) {
      throw new ValidationError('Timer must have a startedAt.')
    }
    if (!(duration instanceof Duration)) {
      throw new ValidationError('Timer must have a duration.')
    }
  }
}
