import { type UserRepository } from '@/domain/user'

export interface UserRemoveTemplateProps {
  userId: string
  templateId: string
}

export class UserRemoveTemplate {
  constructor(private readonly userRepository: UserRepository) {}
  async removeTemplate(props: UserRemoveTemplateProps): Promise<void> {
    const user = await this.userRepository.getById(props.userId)
    user.removeTemplate(props.templateId)
    await this.userRepository.transaction(async () => {
      await this.userRepository.removeTemplate({
        userId: props.userId,
        templateId: props.templateId
      })
    })
  }
}
