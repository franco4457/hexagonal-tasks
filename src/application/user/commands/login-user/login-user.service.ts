import { type ICommandHandler } from '@/domain/core'
import { type User, type UserRepository, UserNotFound } from '@/domain/user'
import { type LoginUserCommand } from './login-user.command'

export class LoginUserService implements ICommandHandler<LoginUserCommand, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: LoginUserCommand): Promise<User> {
    const user = await this.userRepository.getByEmail(command.email)
    const isValidPass = await user.getProps().password.compare(command.password)
    if (!isValidPass) throw new UserNotFound(command.email, 'email')
    return user
  }
}
