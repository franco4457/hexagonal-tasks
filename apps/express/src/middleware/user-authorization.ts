import { UserAuthorizationBearer } from '@infrastructure/authorization'
import type { RequestHandler } from 'express'

export const userAuthMiddleware: RequestHandler = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization
    const auth = new UserAuthorizationBearer(authHeader as string)
    req.userAuth = auth
    next()
  } catch (err) {
    next(err)
  }
}
