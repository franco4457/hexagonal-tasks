import { type IUser, type IUserCreate, UserEntity, type IUserRepository } from '../domain'

export class UserRegister {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(props: IUserCreate): Promise<IUser> {
    const user = UserEntity.create(props)
    const userRepo = await this.userRepository.create(user)
    return userRepo
  }
}
