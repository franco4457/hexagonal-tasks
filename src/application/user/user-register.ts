import { User, validateUser } from '@/domain/user'
import type { IUserRepository } from '@/domain/user'

export class UserRegister {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(props: unknown): Promise<User> {
    const userInput = await validateUser(props)
    const user = await User.create(userInput)
    await this.userRepository.create(user)
    return user
  }
}
