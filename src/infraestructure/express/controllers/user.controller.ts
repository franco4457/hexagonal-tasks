import { UserLogin, UserRegister } from '@/application/user'
import type { IUserRepository } from '@/domain/user'
import type { Request, Response, NextFunction } from 'express'

export class UserController {
  private readonly userRegister: UserRegister
  private readonly userLogin: UserLogin
  constructor(private readonly userRepostory: IUserRepository) {
    this.userRegister = new UserRegister(this.userRepostory)
    this.userLogin = new UserLogin(this.userRepostory)
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    try {
      const user = await this.userRegister.register(body)
      res.status(200).json({ user })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const body = req.body
    try {
      const user = await this.userLogin.login(body)
      res.status(200).json({ user })
    } catch (error) {
      next(error)
    }
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userRepostory.getAll()
      res.status(200).json({ users })
    } catch (error) {
      next(error)
    }
  }
}
