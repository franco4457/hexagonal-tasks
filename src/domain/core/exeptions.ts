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
    if (issues != null) {
      const message = JSON.stringify(issues.map((issue) => issue.message))
      super(message, 400)
      this.issues = issues
    } else {
      super(message, 400)
    }
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
