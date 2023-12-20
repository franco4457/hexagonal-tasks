import { ResponseBase } from '../core/api/response.base'

export class UserResponseDto extends ResponseBase {
  name!: string
  lastname!: string
  username!: string
  email!: string
}
