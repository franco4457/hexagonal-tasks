import {
  type User,
  type UserPropsLoginInput,
  type UserRepository,
  UserNotFound
} from '@/domain/user'

export class UserLogin {
  constructor(private readonly userRepository: UserRepository) {}

  async login(props: UserPropsLoginInput): Promise<User> {
    const user = await this.userRepository.getByEmail(props.email)
    const isValidPass = await user.getProps().password.compare(props.password)
    if (!isValidPass) throw new UserNotFound(props.email, 'email')
    return user
  }
}
