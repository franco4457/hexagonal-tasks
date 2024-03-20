import {
  LabelByUserIdQuery,
  LabelByUserIdHandler,
  UserAddLabelService,
  UserRemoveLabelCommand,
  UserRemoveLabelService,
  UserAddLabelCommand
} from '@application/user'
import { UserMapper, validateLabel, type UserRepository } from '@domain/user'
import type { Request, Response, NextFunction } from 'express'

export class LabelController {
  private readonly userAddlabel: UserAddLabelService
  private readonly userRemovelabel: UserRemoveLabelService

  private readonly labelByUserIdQuery: LabelByUserIdHandler
  private readonly mapper = new UserMapper().labelMapper
  constructor(private readonly userRepostory: UserRepository) {
    this.userAddlabel = new UserAddLabelService(this.userRepostory)
    this.userRemovelabel = new UserRemoveLabelService(this.userRepostory)
    this.labelByUserIdQuery = new LabelByUserIdHandler(this.userRepostory)
  }

  async addLabel(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      const data = await validateLabel(req.body)
      const newLabel = await this.userAddlabel.execute(
        new UserAddLabelCommand({ userId, label: data })
      )
      res.status(201).json({ label: this.mapper.toResponse(newLabel) })
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
