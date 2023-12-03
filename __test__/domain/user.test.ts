import { UserLogin, UserRegister } from '@/application/user'
import { ValidationError } from '@/domain/core'
import { type IUserLoginInput, type IUserCreate, User } from '@/domain/user'
import { InMemoryUserRepository } from '@/infraestructure/repsitory/in-memory'

const newUser: IUserCreate = {
  email: 'new@mail.com',
  username: 'newUser',
  password: 'Pass1234',
  name: 'new-user',
  lastname: 'user-new'
}

const userMock: IUserLoginInput = {
  email: 'example@mail.com',
  username: '1234',
  password: 'Pass1234'
}
describe('User', () => {
  it('login user', async () => {
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
    expect(expectResult).toEqual(user)
    expect(user).instanceOf(User)
  })
  it('should throw error when user not found', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()

    const userLogin = new UserLogin(inMemoryUserRepository)
    const user = userLogin.login({ ...userMock, email: 'lalala' })
    await expect(user).rejects.toThrow('User with email: lalala not found')
  })
  it('should throw error when password is invalid', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()

    const userLogin = new UserLogin(inMemoryUserRepository)
    const user = userLogin.login({ ...userMock, password: 'lalala' })
    // Throw same error to avoid security issues
    await expect(user).rejects.toThrow('User with email: example@mail.com not found')
  })
  it('register user', async () => {
    const expectResult: IUserCreate = { ...newUser }

    const inMemoryUserRepository = new InMemoryUserRepository()

    const userRegister = new UserRegister(inMemoryUserRepository)
    const user = await userRegister.register(newUser)
    expect(expectResult.name).toEqual(user.name)
    expect(expectResult.email).toEqual(user.email)
    expect(expectResult.lastname).toEqual(user.lastname)
    expect(expectResult.username).toEqual(user.username)
    expect(user.id).toBeTypeOf('string')
    // @ts-expect-error password is private
    expect(user.password).toBeUndefined()
    expect(user).instanceOf(User)
  })
  it('should thorw a validation error if dont send required fields', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()
    const userRegister = new UserRegister(inMemoryUserRepository)
    const register = userRegister.register({})

    await expect(register).rejects.toBeInstanceOf(ValidationError)
    await expect(register).rejects.toThrow(
      '["Name is required","Lastname is required","Username is required","Email is required","Password is required"]'
    )
  })
  it('should thorw a validation error if send invalid fields', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()
    const userRegister = new UserRegister(inMemoryUserRepository)
    const register = userRegister.register({
      name: 1,
      lastname: {},
      username: 10,
      email: [],
      password: 11.5
    })

    await expect(register).rejects.toBeInstanceOf(ValidationError)
    await expect(register).rejects.toThrow(
      '["Invalid type on On \'name\'. expected string, received number","Invalid type on On \'lastname\'. expected string, received object","Invalid type on On \'username\'. expected string, received number","Invalid type on On \'email\'. expected string, received array","Invalid type on On \'password\'. expected string, received number"]'
    )
  })
  it('should throw error when user already exists', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository([{ ...newUser, id: 'asd' }])
    const userRegister = new UserRegister(inMemoryUserRepository)
    await expect(userRegister.register(newUser)).rejects.toThrow(
      'User with email: new@mail.com already exist'
    )
  })
})
