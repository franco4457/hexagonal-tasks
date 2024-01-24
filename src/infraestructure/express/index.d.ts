import type { UserAuthorizationBearer } from '../authorization'

declare global {
  namespace Express {
    interface Request {
      userAuth: UserAuthorizationBearer
    }
  }
}
