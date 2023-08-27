import { IUser, IUserCreate, IUserRepository, UserEntity } from '@/user/domain'
import { randomUUID } from 'node:crypto'

const inMemoryUsers: IUser[] = [
  {
    id: 'asd',
    email: 'example@mail.com',
    lastname: 'tester',
    name: 'test',
    password: '1234',
    username: 'tested',
  },
]

export class InMemoryUserRepositorytory implements IUserRepository {
  async getAll(): Promise<IUser[]> {
    return inMemoryUsers
  }
  async create(user: IUserCreate): Promise<IUser> {
    const newUser = UserEntity.create(user)
    inMemoryUsers.push(newUser)
    return newUser
  }
  async getById(id: string): Promise<IUser> {
    const user = inMemoryUsers.find((user) => user.id === id)
    // TODO coustom Error
    if (!user) throw new Error('User not found')
    return user
  }
}
