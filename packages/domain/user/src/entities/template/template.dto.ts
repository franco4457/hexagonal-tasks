import { ResponseBase } from '@domain/core'
import { type TaskTemplateProps } from '../../value-objects'

export class TemplateResponseDto extends ResponseBase {
  name!: string
  tasks!: TaskTemplateProps[]
}
