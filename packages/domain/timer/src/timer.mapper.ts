import { type Mapper } from '@domain/core'
import { TimerResponseDto } from './timer.dto'
import { Timer, type TimerModel } from './timer.entity'
import { Duration, Stage, StageEnum, Status, StatusEnum } from './value-objects'

export class TimerMapper implements Mapper<Timer, TimerModel, TimerResponseDto> {
  toDomain({
    id,
    createdAt,
    updatedAt,
    stageInterval,
    currentStage,
    longBreak,
    shortBreak,
    pomodoro,
    status,
    currentTaskId,
    userId,
    startedAt,
    stoppedAt,
    pomodoroCounter
  }: TimerModel): Timer {
    const timer = new Timer({
      props: {
        status: new Status(StatusEnum[status]),
        duration: new Duration({
          longBreak,
          shortBreak,
          pomodoro
        }),
        stage: new Stage({
          stageInterval,
          currentStage: StageEnum[currentStage]
        }),
        currentTaskId,
        userId,
        startedAt,
        stoppedAt,
        pomodoroCounter
      },
      createdAt,
      updatedAt,
      id
    })
    return timer
  }

  toPersistence(timer: Timer): TimerModel {
    const props = timer.getProps()
    const { longBreak, pomodoro, shortBreak } = props.duration.value
    return {
      id: props.id,
      currentTaskId: props.currentTaskId,
      userId: props.userId,
      pomodoroCounter: props.pomodoroCounter,
      startedAt: props.startedAt,
      stoppedAt: props.stoppedAt,
      status: props.status.getStatusKey(),
      longBreak,
      pomodoro,
      shortBreak,
      stageInterval: props.stage.stageInterval,
      currentStage: props.stage.getCurrentStageKey(),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    }
  }

  toResponse(domain: Timer): TimerResponseDto {
    const props = domain.getProps()
    const response = new TimerResponseDto(domain)
    response.userId = props.userId
    response.currentTaskId = props.currentTaskId
    response.status = props.status.getStatusKey()
    response.fullDuration = domain.currentDuration
    const now = Date.now()
    const elapsed = props.stoppedAt !== 0 ? now - props.stoppedAt : 0
    response.duration = domain.currentDuration - (elapsed - props.stoppedAt - now)
    response.stageInterval = props.stage.stageInterval
    response.currentStage = props.stage.currentStage
    response.pomodoroCounter = props.pomodoroCounter
    return response
  }
}
