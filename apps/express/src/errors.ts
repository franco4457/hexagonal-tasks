import { DomainError, ValidationError } from '@domain/core'
import { type ErrorRequestHandler } from 'express'

export const mainErrorHanlder: ErrorRequestHandler = (err, _req, res, _next) => {
  if (!(err instanceof DomainError)) {
    res.status(500).json({ error: true, message: 'Unhandled internal error' })
    return
  }
  const { statusCode, ...resErr } = err
  res.status(statusCode)
  if (err instanceof ValidationError) {
    res.json({ error: true, ...resErr, errors: JSON.parse(err.message), message: err.name })
    return
  }
  res.json({ error: true, ...resErr, message: err.message })
}
