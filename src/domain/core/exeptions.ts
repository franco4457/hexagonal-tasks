import type { ZodIssue } from 'zod'

export class DomainError extends Error {
  statusCode = 500
  constructor(message: string, statusCode?: number) {
    super(message)
    if (statusCode != null) this.statusCode = statusCode
  }
}

export class ValidationError extends DomainError {
  issues: ZodIssue[] = []
  constructor(message: string, issues?: ZodIssue[]) {
    super(message, 400)
    if (issues != null) this.issues = issues
  }
}

export class NotFound extends DomainError {
  constructor(message: string) {
    super(message, 404)
  }
}

export class AlreadyExist extends DomainError {
  constructor(message: string) {
    super(message, 409)
  }
}
