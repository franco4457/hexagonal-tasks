import { AuthorizationBearer } from '@/domain/core'

interface UserToken extends Record<string, unknown> {
  id: string
}

export class UserAuthorizationBearer extends AuthorizationBearer<UserToken> {
  get userId(): string {
    return this.decodedToken.id
  }
}
