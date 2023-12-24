import type { User, UserPropsLoginInput, IUserRepository } from '@/domain/user'

export class UserLogin {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(props: UserPropsLoginInput): Promise<User> {
    const user = await this.userRepository.findAndValidate(props.email, props.password)
    const isValidPass = await user.getProps().password.compare(props.password)
    if (!isValidPass) throw new Error('Invalid password')
    return user
  }
}
