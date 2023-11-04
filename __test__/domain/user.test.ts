import { type IUserCreate } from './../../src/domain/user/user.entity'
import { UserLogin, UserRegister } from '@/application/user'
import { type IUserLoginInput } from '@/domain/user'
import { InMemoryUserRepository } from '@/infraestructure/repsitory/in-memory'
describe('user', () => {
  it('login user', async () => {
    const userMock: IUserLoginInput = {
      email: 'example@mail.com',
      username: '1234',
      password: 'tested'
    }
    const expectResult = {
      id: 'asd',
      email: 'example@mail.com',
      lastname: 'tester',
      name: 'test',
      username: 'tested'
    }
    const inMemoryUserRepository = new InMemoryUserRepository()

    const userLogin = new UserLogin(inMemoryUserRepository)
    const user = await userLogin.login(userMock)
    expect(expectResult).toStrictEqual(user)
  })
  it('register user', async () => {
    const newUser: IUserCreate = {
      email: 'new@mail.com',
      username: 'newUser',
      password: '12345',
      name: 'new-user',
      lastname: 'user-new'
    }
    const expectResult: IUserCreate = {
      email: 'new@mail.com',
      username: 'newUser',
      password: '12345',
      name: 'new-user',
      lastname: 'user-new'
    }

    const inMemoryUserRepository = new InMemoryUserRepository()

    const userRegister = new UserRegister(inMemoryUserRepository)
    const user = await userRegister.register(newUser)
    expect(expectResult.name).toEqual(user.name)
    expect(expectResult.email).toEqual(user.email)
    expect(expectResult.lastname).toEqual(user.lastname)
    expect(expectResult.username).toEqual(user.username)
    expect(user.id).toBeTypeOf('string')
  })
})
