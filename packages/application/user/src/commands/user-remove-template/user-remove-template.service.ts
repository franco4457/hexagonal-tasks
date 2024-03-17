import { type ICommandHandler } from '@domain/core'
import { type UserRepository } from '@domain/user'
import { type UserRemoveTemplateCommand } from './user-remove-template.command'

export class UserRemoveTemplateService implements ICommandHandler<UserRemoveTemplateCommand, void> {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(props: UserRemoveTemplateCommand): Promise<void> {
    const user = await this.userRepository.getById(props.userId)
    user.removeTemplate(props.templateId)
    await this.userRepository.transaction(async () => {
      await this.userRepository.removeTemplate({
        user,
        templateId: props.templateId
      })
    })
  }
}
