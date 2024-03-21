import { UserAuthorizationBearer } from '@infrastructure/authorization'
import type { RequestHandler } from 'express'

export const userAuthMiddleware: RequestHandler = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const auth = new UserAuthorizationBearer(authHeader!)
    req.userAuth = auth
    next()
  } catch (err) {
    next(err)
  }
}
