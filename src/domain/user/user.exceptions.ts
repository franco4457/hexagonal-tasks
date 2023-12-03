import { AlreadyExist, NotFound, ValidationError } from '@/domain/core'
import type { IUser } from './user.entity'
import { type ZodIssue } from 'zod'
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

export class InvalidUser extends ValidationError {
  constructor(issues?: ZodIssue[]) {
    super('Invalid user', issues)
  }
}
