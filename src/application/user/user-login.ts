import type { User, IUserLoginInput, IUserRepository } from '@/domain/user'

export class UserLogin {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(props: IUserLoginInput): Promise<User> {
    const user = await this.userRepository.findAndValidate(props.email, props.password)
    return user
  }
}
