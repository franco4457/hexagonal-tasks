import { ResponseBase } from '@domain/core'

export class TaskResponseDto extends ResponseBase {
  title!: string
  description!: string
  isCompleted!: boolean
  userId!: string
  labels!: Array<{ name: string }>
  project!: { name: string } | null
}
