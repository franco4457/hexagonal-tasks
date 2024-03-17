import { type ICommandHandler } from '@domain/core'
import { type User, type UserRepository, UserNotFound } from '@domain/user'
import { type UserLoginCommand } from './user-login.command'

export class UserLoginService implements ICommandHandler<UserLoginCommand, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UserLoginCommand): Promise<User> {
    const user = await this.userRepository.getByEmail(command.email)
    const isValidPass = await user.getProps().password.compare(command.password)
    if (!isValidPass) throw new UserNotFound(command.email, 'email')
    return user
  }
}
