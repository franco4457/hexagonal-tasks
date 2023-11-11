import { type ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

export const mainErrorHanlder: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err)
  if (err instanceof ZodError) {
    res.status(422).json({ error: true, message: JSON.parse(err.message) })
  }
  res.status(500).json({ error: true, message: err.message })
}
