export interface BaseResponseProps {
  id: string
  createdAt: Date
  updatedAt: Date
}

export class ResponseBase {
  readonly id: string
  readonly createdAt: string
  readonly updatedAt: string

  constructor(props: BaseResponseProps) {
    this.id = props.id
    this.createdAt = new Date(props.createdAt).toISOString()
    this.updatedAt = new Date(props.updatedAt).toISOString()
  }
}
