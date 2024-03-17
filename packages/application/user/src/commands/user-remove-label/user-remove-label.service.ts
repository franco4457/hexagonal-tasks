import { type UserRepository } from '@domain/user'
import { type UserRemoveLabelCommand } from './user-remove-label.command'
import { type ICommandHandler } from '@domain/core'

export class UserRemoveLabelService implements ICommandHandler<UserRemoveLabelCommand, void> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UserRemoveLabelCommand): Promise<void> {
    const user = await this.userRepository.getById(command.userId)
    user.removeLabel(command.labelId)
    await this.userRepository.transaction(async () => {
      await this.userRepository.removeLabel({
        user,
        labelId: command.labelId
      })
    })
  }
}
