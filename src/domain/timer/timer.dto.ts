import { ResponseBase } from '@/domain/core'

export class TimerResponseDto extends ResponseBase {
  userId!: string
  currentTaskId!: string | null
  status!: string
  fullDuration!: number
  duration!: number
  stageInterval!: number
  currentStage!: string
  pomodoroCounter!: number
}
