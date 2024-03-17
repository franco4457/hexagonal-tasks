import { type ICommandHandler } from '@domain/core'
import { type Label, UserNotFound, type UserRepository } from '@domain/user'
import { type UserAddLabelCommand } from './user-add-label.command'

export class UserAddLabelService implements ICommandHandler<UserAddLabelCommand, Label> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UserAddLabelCommand): Promise<Label> {
    const user = await this.userRepository.getById(command.userId)
    if (command.userId == null) throw new UserNotFound(command.userId)
    const label = user.addLabel(command.label)
    await this.userRepository.transaction(async () => {
      await this.userRepository.addLabelToUser({ user, label })
    })
    return label
  }
}
