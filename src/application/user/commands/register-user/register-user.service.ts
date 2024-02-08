import { type ICommandHandler } from '@/domain/core'
import { Password, User, validateUser } from '@/domain/user'
import type { UserRepository } from '@/domain/user'
import { type RegisterUserCommand } from './register-user.command'

export class UserRegisterService implements ICommandHandler<RegisterUserCommand, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async excute(command: RegisterUserCommand): Promise<User> {
    const userInput = await validateUser(command)
    const password = await Password.create(userInput.password)
    const user = User.create({ ...userInput, password })
    await this.userRepository.transaction(async () => await this.userRepository.create(user))
    return user
  }
}
