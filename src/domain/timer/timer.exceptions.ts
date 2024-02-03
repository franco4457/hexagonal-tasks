import { AlreadyExist, DomainError, IsRequired, NotFound } from '@/domain/core'
import { type Timer } from './timer.entity'

export class InvalidCurrentStage extends DomainError {
  constructor(message: string = 'Invalid current stage') {
    super(message, { name: 'InvalidCurrentStage', statusCode: 400 })
  }
}

export class TimerFieldRequired extends IsRequired<keyof Timer | keyof Timer['props']> {}

export class TimerAlreadyExists extends AlreadyExist {
  constructor(value: string, field: keyof Timer | keyof Timer['props'] = 'userId') {
    super(`Timer with ${field}: ${value} already exist`)
  }
}

export class TimerNotFound extends NotFound {
  constructor(value: string, field: keyof Timer | keyof Timer['props'] = 'id') {
    super(`Timer with ${field}: ${value} not found`)
  }
}
