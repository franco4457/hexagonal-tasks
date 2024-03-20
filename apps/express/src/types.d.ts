import { UserAuthorizationBearer } from '@infrastructure/authorization'

declare global {
  namespace Express {
    interface Request {
      userAuth: UserAuthorizationBearer
    }
  }
}
