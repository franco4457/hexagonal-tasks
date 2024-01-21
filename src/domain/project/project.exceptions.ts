import { type ZodIssue } from 'zod'
import { ValidationError } from '../core'

export class InvalidProject extends ValidationError {
  constructor(issues?: ZodIssue[]) {
    super('Invalid project', issues)
  }
}
