import { AlreadyExist, IsRequired, NotFound, ValidationError } from '@/domain/core'
import type { User } from './user.entity'
import { type ZodIssue } from 'zod'
export class UserNotFound extends NotFound {
  constructor(value: string, field: keyof User | keyof User['props'] = 'id') {
    super(`User with ${field}: ${value} not found`)
  }
}
// TODO: add support for Enitities and VO props
type PropField<T extends keyof User['props']> = User['props'][T] extends Array<infer U>
  ? `${T}[number].${Extract<keyof U, string>}`
  : `${T}`

export class UserPropNotFound<T extends keyof User['props']> extends NotFound {
  constructor(value: string, field: PropField<T>) {
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
