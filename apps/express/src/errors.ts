import { type DomainError, type ValidationError } from '@domain/core'
import { type ErrorRequestHandler } from 'express'

export const mainErrorHanlder: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err.statusCode == null || err.name == null) {
    res.status(500).json({ error: true, message: 'Unhandled internal error' })
    return
  }
  const {
    statusCode,
    IS_VALIDATION_ERROR = false,
    ...resErr
  } = err as DomainError & { IS_VALIDATION_ERROR?: boolean }

  res.status(statusCode)
  if (IS_VALIDATION_ERROR) {
    const e = err as ValidationError
    res.json({ error: true, ...resErr, errors: JSON.parse(e.message), message: e.name })
    return
  }
  res.json({ error: true, ...resErr, message: err.message })
}
