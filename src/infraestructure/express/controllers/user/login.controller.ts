import { type UserLogin } from '@/application/user'
import { type Request, type Response } from 'express'

export class LoginController {
  constructor(private readonly userLogin: UserLogin) {}
  async run(req: Request, res: Response): Promise<any> {
    const body = req.body
    const user = await this.userLogin.login(body)
    res.status(200).json({ user })
  }
}
