import type { ZodIssue } from 'zod'

export class DomainError extends Error {
  statusCode: number = 500
  name: string
  constructor(
    message: string,
    { name = 'DOMAIN_ERROR', statusCode = 500 }: { name?: string; statusCode?: number } = {}
  ) {
    super(message)
    this.name = name
    if (statusCode != null) this.statusCode = statusCode
  }
}

export class ValidationError extends DomainError {
  issues: ZodIssue[] = []
  constructor(message: string, issues?: ZodIssue[]) {
    if (issues != null) {
      const zMessage = JSON.stringify(issues.map((issue) => issue.message))
      super(zMessage, { statusCode: 422, name: message })
      this.issues = issues
    } else {
      super(message, { name: 'Validation error', statusCode: 422 })
    }
  }
}

export class NotFound extends DomainError {
  constructor(message: string) {
    super(message, { name: 'Not Found', statusCode: 404 })
  }
}

export class AlreadyExist extends DomainError {
  constructor(message: string) {
    super(message, { name: 'Already exist', statusCode: 409 })
  }
}

export class ArgumentNotProvided extends DomainError {
  constructor(message: string) {
    super(message, { name: 'Argument not provided', statusCode: 501 })
  }
}
export class IsRequired<T extends string> extends ValidationError {
  constructor(field: T) {
    super(`${field} is required`)
  }
}

export class Unauthorized extends DomainError {
  constructor(message: string) {
    super(message, { name: 'Unauthorized', statusCode: 401 })
  }
}
