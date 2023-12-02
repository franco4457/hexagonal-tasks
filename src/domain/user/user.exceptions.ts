import { AlreadyExist, NotFound } from '@/domain/core'
import type { IUser } from './user.entity'
export class UserNotFound extends NotFound {
  constructor(value: string, field: keyof IUser = 'id') {
    super(`User with ${field}: ${value} not found`)
  }
}

export class UserAlreadyExist extends AlreadyExist {
  constructor(value: string, field: keyof IUser = 'email') {
    super(`User with ${field}: ${value} already exist`)
  }
}
