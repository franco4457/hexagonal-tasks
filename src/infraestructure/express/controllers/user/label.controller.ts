import {
  LabelByUserIdQuery,
  LabelByUserIdHandler,
  UserAddLabelService,
  UserRemoveLabelCommand,
  UserRemoveLabelService
} from '@/application/user'
import type { UserRepository } from '@/domain/user'
import type { Request, Response, NextFunction } from 'express'

export class LabelController {
  private readonly userAddlabel: UserAddLabelService
  private readonly userRemovelabel: UserRemoveLabelService

  private readonly labelByUserIdQuery: LabelByUserIdHandler
  constructor(private readonly userRepostory: UserRepository) {
    this.userAddlabel = new UserAddLabelService(this.userRepostory)
    this.userRemovelabel = new UserRemoveLabelService(this.userRepostory)
    this.labelByUserIdQuery = new LabelByUserIdHandler(this.userRepostory)
  }

  async addLabel(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.userAuth.decodedToken
    const body = req.body
    try {
      await this.userAddlabel.execute({ ...body, id })
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  async removeLabel(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    const { labelId } = req.params
    try {
      await this.userRemovelabel.execute(new UserRemoveLabelCommand({ userId, labelId }))
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  async getLabels(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.userAuth.decodedToken
    try {
      const labels = await this.labelByUserIdQuery.execute(new LabelByUserIdQuery({ userId: id }))
      res.status(200).json({ labels })
    } catch (error) {
      next(error)
    }
  }
}
