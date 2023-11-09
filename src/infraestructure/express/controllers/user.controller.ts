import { UserLogin, UserRegister } from '@/application/user'
import type { IUserRepository } from '@/domain/user'
import { type Request, type Response } from 'express'

export class UserController {
  private readonly userRegister: UserRegister
  private readonly userLogin: UserLogin
  constructor(private readonly userRepostory: IUserRepository) {
    this.userRegister = new UserRegister(this.userRepostory)
    this.userLogin = new UserLogin(this.userRepostory)
  }

  async register(req: Request, res: Response): Promise<void> {
    const body = req.body
    const user = await this.userRegister.register(body)
    res.status(200).json({ user })
  }

  async login(req: Request, res: Response): Promise<void> {
    const body = req.body
    const user = await this.userLogin.login(body)
    res.status(200).json({ user })
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const users = await this.userRepostory.getAll()
    res.status(200).json({ users })
  }
}
