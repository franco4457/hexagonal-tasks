import { type IUserPublic, type IUserLoginInput, type IUserRepository } from '../domain'

export class UserLogin {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(props: IUserLoginInput): Promise<IUserPublic> {
    const { password, ...user } = await this.userRepository.getByEmail(props.email)
    // TOOD validate password
    return user
  }
}
