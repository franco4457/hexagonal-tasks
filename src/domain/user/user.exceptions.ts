import { NotFound } from '../core/exeptions'
import type { IUser } from './user.entity'
export class UserNotFound extends NotFound {
  constructor(value: string, field: keyof IUser = 'id') {
    super(`User with ${field}: ${value} not found`)
  }
}
