import { ResponseBase } from '@domain/core'

export class UserResponseDto extends ResponseBase {
  name!: string
  lastname!: string
  username!: string
  email!: string
}
