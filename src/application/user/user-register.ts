import { UserEntity } from '@/domain/user'
import type { IUserCreate, IUserRepository, IUserPublic } from '@/domain/user'

export class UserRegister {
  constructor(private readonly userRepository: IUserRepository) {}

  async register(props: IUserCreate): Promise<IUserPublic> {
    const user = UserEntity.create(props)
    const userRepo = await this.userRepository.create(user)
    return userRepo
  }
}
