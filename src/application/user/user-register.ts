import { User, validateUser } from '@/domain/user'
import type { IUserRepository, IUser } from '@/domain/user'

export class UserRegister {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(props: unknown): Promise<IUser> {
    const userInput = await validateUser(props)
    const user = User.create(userInput)
    await this.userRepository.create({ ...user, password: userInput.password })

    return user
  }
}
