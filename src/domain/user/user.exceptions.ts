import { AlreadyExist, IsRequired, NotFound, ValidationError } from '@/domain/core'
import type { User } from './user.entity'
import { type ZodIssue } from 'zod'
export class UserNotFound extends NotFound {
  constructor(value: string, field: keyof User | keyof User['props'] = 'id') {
    super(`User with ${field}: ${value} not found`)
  }
}

export class UserAlreadyExist extends AlreadyExist {
  constructor(value: string, field: keyof User | keyof User['props'] = 'email') {
    super(`User with ${field}: ${value} already exist`)
  }
}

export class InvalidUser extends ValidationError {
  constructor(issues?: ZodIssue[]) {
    super('Invalid user', issues)
  }
}

export class UserFieldIsRequired extends IsRequired<keyof User | keyof User['props']> {}
