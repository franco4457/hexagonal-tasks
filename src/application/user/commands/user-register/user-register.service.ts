import { type ICommandHandler } from '@/domain/core'
import { Password, User, validateUser } from '@/domain/user'
import type { UserRepository } from '@/domain/user'
import { type UserRegisterCommand } from './user-register.command'

export class UserRegisterService implements ICommandHandler<UserRegisterCommand, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: UserRegisterCommand): Promise<User> {
    const userInput = await validateUser(command)
    const password = await Password.create(userInput.password)
    const user = User.create({ ...userInput, password })
    await this.userRepository.transaction(async () => await this.userRepository.create(user))
    return user
  }
}
