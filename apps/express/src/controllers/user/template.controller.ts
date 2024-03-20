import {
  TemplateByUserIdQueryHandler,
  UserAddTemplateCommand,
  UserAddTemplateService,
  UserRemoveTemplateCommand,
  UserRemoveTemplateService,
  UserUpdateTemplateCommand,
  UserUpdateTemplateService
} from '@application/user'
import { validateTemplate, type UserRepository, UserMapper } from '@domain/user'
import type { Request, Response, NextFunction } from 'express'

export class TemplateController {
  private readonly userAddTemplate: UserAddTemplateService
  private readonly userUpdateTemplate: UserUpdateTemplateService
  private readonly userRemoveTemplate: UserRemoveTemplateService

  private readonly templateByUserId: TemplateByUserIdQueryHandler
  private readonly mapper = new UserMapper().templateMapper
  constructor(private readonly userRepostory: UserRepository) {
    this.userAddTemplate = new UserAddTemplateService(this.userRepostory)
    this.userUpdateTemplate = new UserUpdateTemplateService(this.userRepostory)
    this.userRemoveTemplate = new UserRemoveTemplateService(this.userRepostory)
    this.templateByUserId = new TemplateByUserIdQueryHandler(this.userRepostory)
  }

  async addTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken

    try {
      const template = await validateTemplate(req.body)
      const newTemplate = await this.userAddTemplate.execute(
        new UserAddTemplateCommand({ template, userId })
      )
      res.status(201).json({ template: this.mapper.toResponse(newTemplate) })
    } catch (error) {
      next(error)
    }
  }

  async updateTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      const newProps = await validateTemplate(req.body)
      await this.userUpdateTemplate.execute(
        new UserUpdateTemplateCommand({ templateId: req.body.id, newProps, userId })
      )
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  async removeTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    const { templateId } = req.params
    try {
      await this.userRemoveTemplate.execute(new UserRemoveTemplateCommand({ userId, templateId }))
      res.status(201).end()
    } catch (error) {
      next(error)
    }
  }

  async getTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id } = req.userAuth.decodedToken
    try {
      const templates = await this.templateByUserId.execute({ userId: id })
      res.status(200).json({ templates })
    } catch (error) {
      next(error)
    }
  }
}
