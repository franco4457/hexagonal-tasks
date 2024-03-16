import { ValidationError } from '@domain/core'
import type { ZodIssue } from 'zod'

export class InvalidTemplate extends ValidationError {
  constructor(issues?: ZodIssue[]) {
    super('Invalid template', issues)
  }
}
