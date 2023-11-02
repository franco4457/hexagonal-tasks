import { type IUserPublic, type IUserLoginInput, type IUserRepository } from '@/domain/user'

export class UserLogin {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(props: IUserLoginInput): Promise<IUserPublic> {
    // TOOD validate password
    return await this.userRepository.getByEmail(props.email)
  }
}
