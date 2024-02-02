import { type Label, UserNotFound, type UserRepository } from '@/domain/user'

export interface AddLabelProps {
  userId: string
  label: { name: string }
}

export class UserAddLabel {
  constructor(private readonly userRepository: UserRepository) {}

  async addLabel(props: AddLabelProps): Promise<Label> {
    const user = await this.userRepository.getById(props.userId)
    if (props.userId == null) throw new UserNotFound(props.userId)
    const label = user.addLabel(props.label)
    await this.userRepository.transaction(async () => {
      await this.userRepository.addLabelToUser({ user, label })
    })
    return label
  }
}
