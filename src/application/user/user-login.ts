import type { User, IUserLoginInput, IUserRepository } from '@/domain/user'

export class UserLogin {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(props: IUserLoginInput): Promise<User> {
    // TODO validate password
    return await this.userRepository.getByEmail(props.email)
  }
}
