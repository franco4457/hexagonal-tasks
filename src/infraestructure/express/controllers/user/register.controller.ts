import { type UserRegister } from '@/application/user'
import { type Request, type Response } from 'express'

export class RegisterController {
  constructor(private readonly userRegister: UserRegister) {}
  async run(req: Request, res: Response): Promise<void> {
    const body = req.body
    const user = await this.userRegister.register(body)
    res.status(200).json({ user })
  }
}
