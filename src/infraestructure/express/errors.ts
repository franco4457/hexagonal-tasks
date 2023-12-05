import { AlreadyExist, DomainError, NotFound, ValidationError } from '@/domain/core'
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
  if (err instanceof AlreadyExist) {
    res.json({ error: true, ...resErr, message: err.message })
    return
  }
  if (err instanceof NotFound) {
    res.json({ error: true, ...resErr, message: err.message })
    return
  }
  res.json({ error: true, ...resErr, message: err.message })
}
