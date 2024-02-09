import {
  UserAddLabelService,
  UserAddTemplateService,
  UserLoginService,
  UserRegisterService,
  UserRemoveLabelService,
  UserRemoveTemplateService,
  UserUpdateTemplateService,
  UserLoginCommand,
  UserRegisterCommand,
  UserAddLabelCommand,
  UserAddTemplateCommand,
  UserRemoveTemplateCommand,
  UserUpdateTemplateCommand,
  UserRemoveLabelCommand
} from '@/application/user'
import { ValidationError } from '@/domain/core'
import {
  type UserPropsLoginInput,
  User,
  Password,
  Label,
  Template,
  TaskTemplate,
  UserNotFound
} from '@/domain/user'
import { InMemoryUserRepository } from '@/infraestructure/repository/in-memory'
import { TEST_ID } from '__test__/utils'
import EventEmitter2 from 'eventemitter2'

const newUser = {
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

const repoConfig = {
  appContext: 'TEST',
  eventEmitter: new EventEmitter2()
}

const MOCK_TASK_TEMPLATE = {
  name: 'test-task',
  description: 'test-description',
  order: 1,
  pomodoroEstimated: 1,
  projectId: null
}
describe.concurrent('User', async () => {
  const DEFAULT_USER = {
    id: TEST_ID,
    ...newUser,
    labels: [],
    templates: [],
    password: '$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  it.concurrent('login user', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)

    const userLogin = new UserLoginService(inMemoryUserRepository)
    const user = await userLogin.execute(new UserLoginCommand(userMock))
    const userProps = user.getProps()
    expect(user).instanceOf(User)
    expect(userProps.name).toEqual('test')
    expect(userProps.email).toEqual('example@mail.com')
    expect(userProps.lastname).toEqual('tester')
    expect(userProps.username).toEqual('tested')
    expect(userProps.templates).toEqual([])
    expect(userProps.labels).toEqual([])
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
    expect(user.id).toBeTypeOf('string')
    expect(userProps.password).toBeInstanceOf(Password)
  })
  it.concurrent('register user', async () => {
    const expectResult = { ...newUser }

    const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)

    const userRegister = new UserRegisterService(inMemoryUserRepository)
    const user = await userRegister.execute(new UserRegisterCommand(newUser))
    const userProps = user.getProps()
    expect(expectResult.name).toEqual(userProps.name)
    expect(expectResult.email).toEqual(userProps.email)
    expect(expectResult.lastname).toEqual(userProps.lastname)
    expect(expectResult.username).toEqual(userProps.username)
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
    expect(user.id).toBeTypeOf('string')
    expect(userProps.password).toBeDefined()
    expect(userProps.password).toBeInstanceOf(Password)
    expect(user).instanceOf(User)
  })
  it.concurrent('Add label to user', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)
    const addLablel = new UserAddLabelService(inMemoryUserRepository)
    await addLablel.execute(
      new UserAddLabelCommand({ userId: TEST_ID, label: { name: 'test-label' } })
    )
    const user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user).toBeInstanceOf(User)
    expect(user.labels).toHaveLength(1)
    const label = user.labels[0]
    expect(label).toBeInstanceOf(Label)
    expect(label.getProps().name).toEqual('test-label')
    expect(label.id).toBeTypeOf('string')
    // UUID should be 36 characters long
    expect(label.id).toHaveLength(36)
  })
  it.concurrent('Remove label from user', async () => {
    const now = new Date()
    const mockLabel = {
      id: TEST_ID,
      name: 'test-label',
      createdAt: now,
      updatedAt: now
    }
    const inMemoryUserRepository = new InMemoryUserRepository({
      ...repoConfig,
      users: [
        {
          ...DEFAULT_USER,
          labels: [
            {
              ...mockLabel
            },
            {
              ...mockLabel,
              id: TEST_ID.replace('1', '2'),
              name: 'test-label-not-removed'
            }
          ]
        }
      ]
    })
    let user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user.labels).toHaveLength(2)
    expect(user.labels[0]).toBeInstanceOf(Label)
    expect(user.labels[0].id).toBe(TEST_ID)
    expect(user.labels[1]).toBeInstanceOf(Label)

    const removeLabel = new UserRemoveLabelService(inMemoryUserRepository)
    await removeLabel.execute(new UserRemoveLabelCommand({ userId: TEST_ID, labelId: TEST_ID }))
    user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user.labels).toHaveLength(1)
    const label = user.labels[0]
    expect(label).toBeInstanceOf(Label)
    expect(label.getProps().name).toEqual('test-label-not-removed')
    expect(label.id).toBe(TEST_ID.replace('1', '2'))
  })
  it.concurrent('Add template to User', async () => {
    const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)
    const addTemplate = new UserAddTemplateService(inMemoryUserRepository)
    const newTemp = {
      name: 'test-template',
      tasks: [{ ...MOCK_TASK_TEMPLATE }]
    }
    await addTemplate.execute(new UserAddTemplateCommand({ userId: TEST_ID, template: newTemp }))
    const user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user).toBeInstanceOf(User)
    expect(user.templates).toHaveLength(1)

    const template = user.templates[0]
    expect(template).toBeInstanceOf(Template)
    const props = template.getProps()
    expect(props.name).toEqual('test-template')
    expect(props.tasks).toHaveLength(1)
    expect(props.tasks[0].value).toEqual(MOCK_TASK_TEMPLATE)
    expect(props.id).toBeTypeOf('string')
    // UUID should be 36 characters long
    expect(props.id).toHaveLength(36)
  })
  it.concurrent('Remove template from user', async () => {
    const now = new Date()
    const mockTemplate = {
      id: TEST_ID,
      name: 'test-template',
      tasks: [{ ...MOCK_TASK_TEMPLATE }],
      createdAt: now,
      updatedAt: now
    }
    const inMemoryUserRepository = new InMemoryUserRepository({
      ...repoConfig,
      users: [
        {
          ...DEFAULT_USER,
          templates: [
            {
              ...mockTemplate
            },
            {
              ...mockTemplate,
              id: TEST_ID.replace('1', '2'),
              name: 'test-template-not-removed'
            }
          ]
        }
      ]
    })
    let user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user.templates).toHaveLength(2)
    expect(user.templates[0]).toBeInstanceOf(Template)
    expect(user.templates[0].id).toBe(TEST_ID)
    expect(user.templates[1]).toBeInstanceOf(Template)

    const removeTemplate = new UserRemoveTemplateService(inMemoryUserRepository)
    await removeTemplate.execute(
      new UserRemoveTemplateCommand({ userId: TEST_ID, templateId: TEST_ID })
    )
    user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user.templates).toHaveLength(1)
    const template = user.templates[0]
    expect(template).toBeInstanceOf(Template)
    expect(template.getProps().name).toEqual('test-template-not-removed')
    expect(template.id).toBe(TEST_ID.replace('1', '2'))
  })
  it.concurrent('Update template from user', async () => {
    const now = new Date()
    const mockTemplate = {
      id: TEST_ID,
      name: 'test-template',
      tasks: [{ ...MOCK_TASK_TEMPLATE }],
      createdAt: now,
      updatedAt: now
    }
    const inMemoryUserRepository = new InMemoryUserRepository({
      ...repoConfig,
      users: [
        {
          ...DEFAULT_USER,
          templates: [
            {
              ...mockTemplate
            }
          ]
        }
      ]
    })

    let user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user.templates).toHaveLength(1)
    expect(user.templates[0].getProps()).toEqual({
      ...mockTemplate,
      tasks: [new TaskTemplate({ ...MOCK_TASK_TEMPLATE })]
    })
    const updateTemplate = new UserUpdateTemplateService(inMemoryUserRepository)
    await updateTemplate.execute(
      new UserUpdateTemplateCommand({
        userId: TEST_ID,
        templateId: TEST_ID,
        newProps: {
          name: 'updated-name',
          tasks: [
            {
              ...MOCK_TASK_TEMPLATE,
              name: 'updated-task',
              description: 'updated-description',
              order: 2,
              pomodoroEstimated: 2,
              projectId: TEST_ID
            }
          ]
        }
      })
    )

    user = await inMemoryUserRepository.getById(TEST_ID)
    expect(user.templates).toHaveLength(1)
    const template = user.templates[0]
    expect(template).toBeInstanceOf(Template)
    expect(template.getProps()).toEqual({
      ...mockTemplate,
      name: 'updated-name',
      tasks: [
        new TaskTemplate({
          name: 'updated-task',
          description: 'updated-description',
          order: 2,
          pomodoroEstimated: 2,
          projectId: TEST_ID
        })
      ],
      updatedAt: expect.any(Date)
    })
  })
  describe.concurrent('Exceptions', async () => {
    it.concurrent('should throw error when user not found', async () => {
      const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)

      const userLogin = new UserLoginService(inMemoryUserRepository)
      try {
        await userLogin.execute(new UserLoginCommand({ ...userMock, email: 'lalala' }))
      } catch (e) {
        expect(e).toBeInstanceOf(UserNotFound)
        expect((e as Error).message).toBe('User with email: lalala not found')
      }
    })
    it.concurrent('should throw error when password is invalid', async () => {
      const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)

      const userLogin = new UserLoginService(inMemoryUserRepository)
      try {
        await userLogin.execute(new UserLoginCommand({ ...userMock, password: 'lalala' }))
      } catch (e) {
        // Throw same error to avoid security issues
        expect(e).toBeInstanceOf(UserNotFound)
        expect((e as Error).message).toBe('User with email: example@mail.com not found')
      }
    })
    it.concurrent('should thorw a validation error if dont send required fields', async () => {
      const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)
      const userRegister = new UserRegisterService(inMemoryUserRepository)
      try {
        // @ts-expect-error Testing invalid input
        await userRegister.execute({})
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError)
        expect((e as Error).message).toBe(
          '["Name is required","Lastname is required","Username is required","Email is required","Password is required"]'
        )
      }
    })
    it.concurrent('should thorw a validation error if send invalid fields', async () => {
      const inMemoryUserRepository = new InMemoryUserRepository(repoConfig)
      const userRegister = new UserRegisterService(inMemoryUserRepository)

      try {
        await userRegister.execute({
          // @ts-expect-error Testing invalid input
          name: 1,
          // @ts-expect-error Testing invalid input
          lastname: {},
          // @ts-expect-error Testing invalid input
          username: 10,
          // @ts-expect-error Testing invalid input
          email: [],
          // @ts-expect-error Testing invalid input
          password: 11.5
        })
      } catch (e) {
        expect(e).toBeInstanceOf(ValidationError)
        expect((e as Error).message).toBe(
          '["Invalid type on \'name\'. expected string, received number","Invalid type on \'lastname\'. expected string, received object","Invalid type on \'username\'. expected string, received number","Invalid type on \'email\'. expected string, received array","Invalid type on \'password\'. expected string, received number"]'
        )
      }
    })
    it.concurrent('should throw error when user already exists', async () => {
      const inMemoryUserRepository = new InMemoryUserRepository({
        ...repoConfig,
        users: [
          {
            ...newUser,
            id: 'asd',
            labels: [],
            templates: [],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      })

      const userRegister = new UserRegisterService(inMemoryUserRepository)

      try {
        await userRegister.execute(new UserRegisterCommand(newUser))
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toBe('User with email: new@mail.com already exist')
      }
    })
    // TODO: Check if exceptions need to be tested in [add/remove/update]: [Label/Template]
  })
})
