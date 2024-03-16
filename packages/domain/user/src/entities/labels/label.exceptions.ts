import { ValidationError } from '@domain/core'
import { type ZodIssue } from 'zod'

export class InvalidLabel extends ValidationError {
  constructor(issues?: ZodIssue[]) {
    super('Invalid label', issues)
  }
}
