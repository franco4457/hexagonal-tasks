import { ValidationError } from '@/domain/core'
import { Password, User, UserCreateEvent, UserFieldIsRequired } from '@/domain/user'

const baseProps = {
  name: 'test',
  lastname: 'test',
  username: 'test',
  email: 'test@email.com'
}

describe.concurrent('User Domain', () => {
  it.concurrent('should create a user instance', async () => {
    const pass = new Password('$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u')
    const props = {
      ...baseProps,
      password: pass
    }
    const user = new User({
      id: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a',
      props
    })
    expect(user).toBeInstanceOf(User)
    expect(user.id).toBe('c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a')
    expect(user.getCreatedAt()).toBeInstanceOf(Date)
    expect(user.getUpdatedAt()).toBeInstanceOf(Date)
  })
  it.concurrent('should create a user intance with create method', async () => {
    const pass = await Password.create('Test1234')
    const props = {
      ...baseProps,
      password: pass
    }
    const user = User.create(props)
    expect(user).toBeInstanceOf(User)
    expect(user.id).toBeTypeOf('string')
    expect(user.getCreatedAt()).toBeInstanceOf(Date)
    expect(user.getUpdatedAt()).toBeInstanceOf(Date)
    const now = user.getCreatedAt()
    expect(user.getProps()).toStrictEqual({ ...props, createdAt: now, updatedAt: now, id: user.id })
  })
  it.concurrent('should be add event on create', async () => {
    const pass = await Password.create('Test1234')
    const props = {
      ...baseProps,
      password: pass
    }
    const user = User.create(props)
    const events = user.domainEvents
    expect(events).toHaveLength(1)
    const e = events[0] as UserCreateEvent
    expect(e).toBeInstanceOf(UserCreateEvent)
    expect(e.aggregateId).toBe(user.id)
    expect(e.email).toBe(user.getProps().email)
    expect(e.username).toBe(user.getProps().username)
  })
  describe.concurrent('Exceptions', () => {
    it.concurrent('User name is required', async () => {
      const pass = await Password.create('Test1234')
      const props = {
        ...baseProps,
        name: '',
        password: pass
      }
      try {
        User.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(UserFieldIsRequired)
        expect((e as Error).message).toBe('name is required')
      }
    })
    it.concurrent('User lastname is required', async () => {
      const pass = await Password.create('Test1234')
      const props = {
        ...baseProps,
        lastname: '',
        password: pass
      }
      try {
        User.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(UserFieldIsRequired)
        expect((e as Error).message).toBe('lastname is required')
      }
    })
    it.concurrent('User username is required', async () => {
      const pass = await Password.create('Test1234')
      const props = {
        ...baseProps,
        username: '',
        password: pass
      }
      try {
        User.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(UserFieldIsRequired)
        expect((e as Error).message).toBe('username is required')
      }
    })
    it.concurrent('User email is required', async () => {
      const pass = await Password.create('Test1234')
      const props = {
        ...baseProps,
        email: '',
        password: pass
      }
      try {
        User.create(props)
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(UserFieldIsRequired)
        expect((e as Error).message).toBe('email is required')
      }
    })
    it.concurrent('User password should be instance of Password', async () => {
      const props = {
        ...baseProps
      }
      try {
        // @ts-expect-error Testing purpose
        User.create(props)
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError)
        expect((e as Error).message).toBe('user.password should be a Password instance')
      }
    })
  })
})
