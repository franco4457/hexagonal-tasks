import { type UserRepository } from '@/domain/user'

export interface RemoveLabelProps {
  userId: string
  labelId: string
}

export class UserRemoveLabel {
  constructor(private readonly userRepository: UserRepository) {}

  async removeLabel(props: RemoveLabelProps): Promise<void> {
    const user = await this.userRepository.getById(props.userId)
    user.removeLabel(props.labelId)
    await this.userRepository.transaction(async () => {
      await this.userRepository.removeLabel({
        user,
        labelId: props.labelId
      })
    })
  }
}
