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
import {
  TimerCreateEvent,
  TimerStartEvent,
  TimerFinishEvent,
  TimerStopEvent,
  TimerResumeEvent,
  TimerChangeStageEvent
} from './events'
import { InvalidCurrentStage, TimerFieldRequired } from './timer.exceptions'

export interface TimerProps {
  userId: AggregateID
  currentTaskId: AggregateID | null
  status: Status
  duration: Duration
  stage: Stage
  startedAt: number
  stoppedAt: number
  pomodoroCounter: number
}

export interface TimerCreateProps {
  userId: AggregateID
  fullDuration?: number
  duration?: Partial<DurationProps>
  stage?: Partial<StageProps>
}

export type TimerModel = Omit<TimerProps, 'status' | 'duration' | 'stage'> & {
  id: string
  status: keyof typeof StatusEnum
  duration: DurationProps
  stage: {
    stageInterval: number
    currentStage: keyof typeof StageEnum
  }
  createdAt: Date
  updatedAt: Date
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
        stoppedAt: 0,
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
    if (!this.props.status.isReady()) {
      throw new InvalidCurrentStage('Timer is not ready to start.')
    }
    const now = Date.now()
    this.props.status = new Status(StatusEnum.RUNNING)
    this.props.startedAt = now
    this.props.stoppedAt = 0
    this.addEvent(
      new TimerStartEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        duration: this.currentDuration,
        startedAt: now
      })
    )
  }

  stop(): void {
    if (!this.props.status.isRunning()) {
      throw new InvalidCurrentStage('Timer is not running.')
    }
    const now = Date.now()
    this.props.status = new Status(StatusEnum.PAUSED)
    this.props.stoppedAt = now
    this.addEvent(
      new TimerStopEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        stage: this.props.stage.currentStage,
        stoppedAt: now
      })
    )
  }

  resume(): void {
    if (!this.props.status.isPaused()) {
      throw new InvalidCurrentStage('Timer is not paused.')
    }
    const now = Date.now()
    this.props.status = new Status(StatusEnum.RUNNING)
    this.props.startedAt = now
    this.addEvent(
      new TimerResumeEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        duration: this.currentDuration - (this.props.stoppedAt - this.props.startedAt),
        startedAt: now,
        stoppedAt: this.props.stoppedAt
      })
    )
  }

  finish(): void {
    if (!this.props.status.isRunning()) {
      throw new InvalidCurrentStage('Timer is not running.')
    }
    this.props.status = new Status(StatusEnum.READY)
    const prev = this.props.stage.currentStage
    this.props.startedAt = 0
    this.props.stoppedAt = 0
    this.updateCounter()
    this.updateStage()
    this.addEvent(
      new TimerFinishEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        currentTaskId: this.props.currentTaskId,
        pomodoroCounter: this.props.pomodoroCounter,
        prevStage: prev,
        nextStage: this.props.stage.currentStage
      })
    )
  }

  private updateCounter(): void {
    if (this.props.stage.currentStage === StageEnum.POMODORO) {
      this.props.pomodoroCounter++
    }
  }

  private updateStage(): void {
    const {
      stage: { currentStage, stageInterval }
    } = this.props
    if (currentStage !== StageEnum.POMODORO) {
      this.props.stage = new Stage({
        stageInterval,
        currentStage: StageEnum.POMODORO
      })
    } else {
      const { pomodoroCounter } = this.props
      const isLongBreak = pomodoroCounter % stageInterval === 0
      this.props.stage = new Stage({
        stageInterval,
        currentStage: isLongBreak ? StageEnum.LONG_BREAK : StageEnum.SHORT_BREAK
      })
    }
  }

  changeToPomodoroStage(): void {
    if (this.props.stage.currentStage === StageEnum.POMODORO) {
      throw new InvalidCurrentStage('Timer is already in Pomodoro stage')
    }
    this.changeStage(StageEnum.POMODORO)
  }

  changeToShortBreakStage(): void {
    if (this.props.stage.currentStage === StageEnum.SHORT_BREAK) {
      throw new InvalidCurrentStage('Timer is already in Short Break stage')
    }
    this.changeStage(StageEnum.SHORT_BREAK)
  }

  changeToLongBreakStage(): void {
    if (this.props.stage.currentStage === StageEnum.LONG_BREAK) {
      throw new InvalidCurrentStage('Timer is already in Long Break stage')
    }
    this.changeStage(StageEnum.LONG_BREAK)
  }

  private changeStage(stage: StageEnum): void {
    this.addEvent(
      new TimerChangeStageEvent({
        aggregateId: this.id,
        userId: this.props.userId,
        oldStage: this.props.stage.currentStage,
        newStage: stage.toString()
      })
    )
    this.props.startedAt = 0
    this.props.stoppedAt = 0
    this.props.status = new Status(StatusEnum.READY)
    this.props.stage = new Stage({
      ...this.props.stage.value,
      currentStage: stage
    })
  }

  validate(): void {
    const { userId, status, startedAt, duration, pomodoroCounter, stage, stoppedAt } = this.props
    if (isEmpty(userId)) throw new TimerFieldRequired('userId')
    if (isEmpty(startedAt)) throw new TimerFieldRequired('startedAt')
    if (isEmpty(stoppedAt)) throw new TimerFieldRequired('stoppedAt')
    if (isEmpty(pomodoroCounter)) throw new TimerFieldRequired('pomodoroCounter')
    if (!(status instanceof Status)) throw new ValidationError('status must be a Status instance')
    if (!(stage instanceof Stage)) throw new ValidationError('stage must be a Stage instance')
    if (!(duration instanceof Duration)) {
      throw new ValidationError('duration must be a Duration instance')
    }
  }
}
