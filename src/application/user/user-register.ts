import { Password, User, validateUser } from '@/domain/user'
import type { UserRepository } from '@/domain/user'

export class UserRegister {
  constructor(private readonly userRepository: UserRepository) {}

  async register(props: unknown): Promise<User> {
    const userInput = await validateUser(props)
    const password = await Password.create(userInput.password)
    const user = User.create({ ...userInput, password })
    await this.userRepository.transaction(async () => await this.userRepository.create(user))
    return user
  }
}
