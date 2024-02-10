import { UserLoginService, UserRegisterService } from '@/application/user'
import { UserMapper, type UserRepository } from '@/domain/user'
import type { Request, Response, NextFunction } from 'express'

export class UserController {
  private readonly userRegister: UserRegisterService
  private readonly userLogin: UserLoginService
  private readonly mapper = new UserMapper()
  constructor(private readonly userRepostory: UserRepository) {
    this.userRegister = new UserRegisterService(this.userRepostory)
    this.userLogin = new UserLoginService(this.userRepostory)
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    try {
      const user = await this.userRegister.execute(body)
      res.status(200).json({ user: this.mapper.toResponse(user) })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    try {
      const user = await this.userLogin.execute(body)
      res.status(200).json({ user: this.mapper.toResponse(user) })
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
}
