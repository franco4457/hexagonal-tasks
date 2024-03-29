import {
  UserByUserIdQuery,
  UserByUserIdQueryHandler,
  UserLoginCommand,
  UserLoginService,
  UserRegisterCommand,
  UserRegisterService
} from '@application/user'
import { UserMapper, type UserRepository } from '@domain/user'
import { UserAuthorizationBearer } from '@infrastructure/authorization'
import type { Request, Response, NextFunction } from 'express'

export class UserController {
  private readonly userRegister: UserRegisterService
  private readonly userLogin: UserLoginService
  private readonly userByIdQuery: UserByUserIdQueryHandler

  private readonly mapper = new UserMapper()
  constructor(private readonly userRepostory: UserRepository) {
    this.userRegister = new UserRegisterService(this.userRepostory)
    this.userLogin = new UserLoginService(this.userRepostory)
    this.userByIdQuery = new UserByUserIdQueryHandler(this.userRepostory)
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    try {
      const user = await this.userRegister.execute(
        new UserRegisterCommand({
          email: body.email,
          password: body.password,
          username: body.username,
          lastname: body.lastname,
          name: body.name
        })
      )
      const token = UserAuthorizationBearer.create({ id: user.id })
      res.status(200).json({ token })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    try {
      const user = await this.userLogin.execute(
        new UserLoginCommand({ email: body.email, password: body.password })
      )
      const token = UserAuthorizationBearer.create({ id: user.id })
      res.status(200).json({ token })
    } catch (error) {
      next(error)
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userRepostory.getAll()
      res.status(200).json({ users: users.map((user) => this.mapper.toResponse(user)) })
    } catch (error) {
      next(error)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.userAuth.decodedToken
      const user = await this.userByIdQuery.execute(new UserByUserIdQuery({ id }))
      res.status(200).json({ user: this.mapper.toResponse(user) })
    } catch (error) {
      next(error)
    }
  }
}
