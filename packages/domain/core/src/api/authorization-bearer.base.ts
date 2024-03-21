import { Unauthorized } from '../exeptions'
import { isEmpty } from '../guard'
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

type AuthorizationBearerProps = `Bearer ${string}` | string
export class AuthorizationBearer<DataToken extends Record<string, unknown>> {
  private readonly _value: AuthorizationBearerProps
  private readonly _decodedToken: DataToken
  constructor(props: AuthorizationBearerProps) {
    this.validate(props)
    this._value = props
    const token = this._value.split(' ')[1]
    try {
      this._decodedToken = verify(token, JWT_SECRET) as DataToken
    } catch (error) {
      if (error instanceof JsonWebTokenError && error.message === 'jwt malformed') {
        throw new Unauthorized('Authorization token is malformed')
      }
      throw error
    }
  }

  static create(props: Record<string, unknown>): string {
    const token = sign(props, JWT_SECRET)
    return token
  }

  get value(): AuthorizationBearerProps {
    return this._value
  }

  get decodedToken(): DataToken {
    return this._decodedToken
  }

  validate(value: unknown): void {
    if (isEmpty(value)) {
      throw new Unauthorized('Authorization header is required')
    }
    if (typeof value !== 'string') {
      throw new Unauthorized('Authorization header must be a string')
    }
    if (!value.startsWith('Bearer ')) {
      throw new Unauthorized('Authorization header must start with Bearer')
    }
    if (isEmpty(value.split(' ')[1])) {
      throw new Unauthorized('Authorization header must have a token')
    }
  }
}
