import { ResponseBase } from '@/domain/core'

export class ProjectResponseDto extends ResponseBase {
  name!: string
  userId!: string
  pomodoroCount!: number
}
