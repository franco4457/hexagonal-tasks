import { UserLogin, UserRegister } from '@/application/user'
import { ValidationError } from '@/domain/core'
import { type UserPropsLoginInput, type UserPropsCreate, User, Password } from '@/domain/user'
import { InMemoryUserRepository } from '@/infraestructure/repository/in-memory'

const newUser: UserPropsCreate = {
  email: 'new@mail.com',
  username: 'newUser',
  password: 'Pass1234',
  name: 'new-user',
  lastname: 'user-new'
}

const userMock: UserPropsLoginInput = {
  email: 'example@mail.com',
  username: '1234',
  password: 'Pass1234'
}
describe('User', () => {
  it.concurrent('login user', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()

    const userLogin = new UserLogin(inMemoryUserRepository)
    const user = await userLogin.login(userMock)
    const userProps = user.getProps()
    expect(userProps.name).toEqual('test')
    expect(userProps.email).toEqual('example@mail.com')
    expect(userProps.lastname).toEqual('tester')
    expect(userProps.username).toEqual('tested')
    expect(user.getCreatedAt()).toBeInstanceOf(Date)
    expect(user.getUpdatedAt()).toBeInstanceOf(Date)
    expect(user.id).toBeTypeOf('string')
    expect(userProps.password).toBeInstanceOf(Password)
    expect(user).instanceOf(User)
  })
  it.concurrent('should throw error when user not found', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()

    const userLogin = new UserLogin(inMemoryUserRepository)
    const user = userLogin.login({ ...userMock, email: 'lalala' })
    await expect(user).rejects.toThrow('User with email: lalala not found')
  })
  it.concurrent('should throw error when password is invalid', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()

    const userLogin = new UserLogin(inMemoryUserRepository)
    const user = userLogin.login({ ...userMock, password: 'lalala' })
    // Throw same error to avoid security issues
    await expect(user).rejects.toThrow('User with email: example@mail.com not found')
  })
  it.concurrent('register user', async () => {
    const expectResult: UserPropsCreate = { ...newUser }

    const inMemoryUserRepository = new InMemoryUserRepository()

    const userRegister = new UserRegister(inMemoryUserRepository)
    const user = await userRegister.register(newUser)
    const userProps = user.getProps()
    expect(expectResult.name).toEqual(userProps.name)
    expect(expectResult.email).toEqual(userProps.email)
    expect(expectResult.lastname).toEqual(userProps.lastname)
    expect(expectResult.username).toEqual(userProps.username)
    expect(user.getCreatedAt()).toBeInstanceOf(Date)
    expect(user.getUpdatedAt()).toBeInstanceOf(Date)
    expect(user.id).toBeTypeOf('string')
    expect(userProps.password).toBeDefined()
    expect(userProps.password).toBeInstanceOf(Password)
    expect(user).instanceOf(User)
  })
  it.concurrent('should thorw a validation error if dont send required fields', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository()
    const userRegister = new UserRegister(inMemoryUserRepository)
    const register = userRegister.register({})

    await expect(register).rejects.toBeInstanceOf(ValidationError)
    await expect(register).rejects.toThrow(
      '["Name is required","Lastname is required","Username is required","Email is required","Password is required"]'
    )
  })
  it.concurrent('should thorw a validation error if send invalid fields', async () => {
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
  it.concurrent('should throw error when user already exists', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository([
      { ...newUser, id: 'asd', createdAt: new Date(), updatedAt: new Date() }
    ])
    const userRegister = new UserRegister(inMemoryUserRepository)
    await expect(userRegister.register(newUser)).rejects.toThrow(
      'User with email: new@mail.com already exist'
    )
  })
})
