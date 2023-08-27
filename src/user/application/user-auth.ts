import {
  type IUserLoginInput,
  type IUser,
  IUserRepository,
} from '@/user/domain'

// export interface IUserAuthentication {
//   login(user: IUserLoginInput): Promise<IUser>
//   register(user: IUserRegisterInput): Promise<IUser>
// }

// export class UserAuthentication implements IUserAuthentication {
//   constructor(private readonly userRepository: IUserRepository) {}
//   login(user: IUserLoginInput): Promise<IUser> {
//     throw new Error('Method not implemented.')
//   }
//   register(user: IUserRegisterInput): Promise<IUser> {
//     throw new Error('Method not implemented.')
//   }
// }
