export class DomainError extends Error {
  statusCode = 500
  constructor(message: string, statusCode?: number) {
    super(message)
    if (statusCode != null) this.statusCode = statusCode
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class NotFound extends DomainError {
  constructor(message: string) {
    super(message, 404)
  }
}
