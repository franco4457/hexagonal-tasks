import { DomainError, IsRequired } from '../core'
import { type Timer } from './timer.entity'

export class InvalidCurrentStage extends DomainError {
  constructor(message: string = 'Invalid current stage') {
    super(message, { name: 'InvalidCurrentStage', statusCode: 400 })
  }
}

export class TimerFieldRequired extends IsRequired<keyof Timer | keyof Timer['props']> {}
