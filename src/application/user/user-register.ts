import { UserEntity, validateUser } from '@/domain/user'
import type { IUserRepository, IUserPublic } from '@/domain/user'

export class UserRegister {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(props: unknown): Promise<IUserPublic> {
    const userInput = await validateUser(props)
    const user = UserEntity.create(userInput)
    const userRepo = await this.userRepository.create(user)
    return userRepo
  }
}
