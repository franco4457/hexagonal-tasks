import { StageEnum, StatusEnum, type TimerModel } from '@/domain/timer'
import { Schema } from 'mongoose'
import { USER_DI_REF } from '../user/model'
import { TASK_DI_REF } from '../task/model'

export const timerSchema = new Schema<TimerModel & { _id: TimerModel['id'] }>(
  {
    id: { type: 'string', required: true, unique: true, index: true },
    userId: { type: 'string', ref: USER_DI_REF },
    currentTaskId: { type: 'string', ref: TASK_DI_REF },
    status: { type: 'string', required: true, enum: Object.keys(StatusEnum) },
    startedAt: { type: 'number', required: true },
    stoppedAt: { type: 'number', required: true },
    pomodoroCounter: { type: 'number', required: true },
    pomodoro: { type: 'number', required: true },
    shortBreak: { type: 'number', required: true },
    longBreak: { type: 'number', required: true },
    stageInterval: { type: 'number', required: true },
    currentStage: { type: 'string', enum: Object.keys(StageEnum) }
  },
  {
    _id: false,
    timestamps: true
  }
)
