import { type IUserRepository } from '@/domain/user'
import { type Request, type Response } from 'express'

export class GetUserController {
  constructor(private readonly userRepostory: IUserRepository) {}
  async all(_req: Request, res: Response): Promise<any> {
    const users = await this.userRepostory.getAll()
    res.status(200).json({ users })
  }
}
