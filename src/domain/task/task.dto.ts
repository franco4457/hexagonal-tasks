import { ResponseBase } from '../core/api'

export class TaskResponseDto extends ResponseBase {
  title!: string
  description!: string
  isCompleted!: boolean
  userId!: string
}
