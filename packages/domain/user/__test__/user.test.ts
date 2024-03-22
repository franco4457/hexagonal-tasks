import { ValidationError } from '@domain/core'
import {
  Label,
  Password,
  TaskTemplate,
  Template,
  User,
  UserAddLabelEvent,
  UserAddTemplateEvent,
  UserCreateEvent,
  UserFieldIsRequired,
  UserRemoveLabelEvent,
  UserRemoveTemplateEvent,
  UserUpdateTemplateEvent
} from '../src'
import { TEST_ID } from '@config/test/utils'

const baseProps = {
  name: 'test',
  lastname: 'test',
  username: 'test',
  templates: [],
  labels: [],
  email: 'test@email.com'
}
const TASKS = [
  new TaskTemplate({
    name: 'test',
    description: 'test',
    order: 1,
    pomodoroEstimated: 1,
    projectId: null
  })
]

describe.concurrent('User Domain', () => {
  const pass = new Password('$2b$10$LW29SqaXA.1e/ruyZjyjNumC7cItPePd2guY9Eq3udPl62iep9l6u')
  it.concurrent('should create a user instance', async () => {
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
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
  })
  it.concurrent('should create a user intance with create method', async () => {
    const props = {
      ...baseProps,
      password: pass
    }
    const user = User.create(props)
    expect(user).toBeInstanceOf(User)
    expect(user.id).toBeTypeOf('string')
    expect(user.createdAt).toBeInstanceOf(Date)
    expect(user.updatedAt).toBeInstanceOf(Date)
    const now = user.createdAt
    expect(user.getProps()).toStrictEqual({ ...props, createdAt: now, updatedAt: now, id: user.id })
  })
  it.concurrent('should be add event on create', async () => {
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
  it.concurrent('should be add label', async () => {
    const props = {
      ...baseProps,
      password: pass
    }
    const user = User.create(props)
    expect(user.getProps().labels).toHaveLength(0)
    user.addLabel({ name: 'test' })

    const labels = user.getProps().labels
    expect(labels).toHaveLength(1)
    expect(labels[0]).toBeInstanceOf(Label)

    const labelProps = labels[0].getProps()
    expect(labelProps.name).toBe('test')
    expect(labelProps.id).toBeTypeOf('string')

    const events = user.domainEvents
    expect(events).toHaveLength(2)
    const e = events[1] as UserAddLabelEvent
    expect(e).toBeInstanceOf(UserAddLabelEvent)
    expect(e.aggregateId).toBe(user.id)
    expect(e.labelId).toBe(labelProps.id)
  })
  it.concurrent('should be remove label', async () => {
    const label = Label.create({ name: 'testDelete' })
    const props = {
      ...baseProps,
      password: pass,
      labels: [label]
    }
    const user = new User({
      id: TEST_ID,
      props
    })

    const labels = user.getProps().labels
    expect(labels).toHaveLength(1)
    expect(labels[0].getProps().name).toBe('testDelete')
    user.removeLabel(label.getProps().id)

    const events = user.domainEvents
    expect(events).toHaveLength(1)
    const e = events[0] as UserRemoveLabelEvent

    expect(e).toBeInstanceOf(UserRemoveLabelEvent)
    expect(e.aggregateId).toBe(user.id)
    expect(e.labelId).toBe(label.getProps().id)
  })
  it.concurrent('should be add template', async () => {
    const props = {
      ...baseProps,
      password: pass
    }
    const user = User.create(props)
    expect(user.getProps().templates).toHaveLength(0)
    user.addTemplate({ name: 'test', tasks: TASKS })

    const templates = user.getProps().templates
    expect(templates).toHaveLength(1)
    expect(templates[0]).toBeInstanceOf(Template)

    const templateProps = templates[0].getProps()
    expect(templateProps.name).toBe('test')
    expect(templateProps.id).toBeTypeOf('string')
    expect(templateProps.tasks).toHaveLength(1)
    expect(templateProps.tasks[0]).toBeInstanceOf(TaskTemplate)
    expect(templateProps.tasks[0]).toBe(TASKS[0])

    const events = user.domainEvents
    expect(events).toHaveLength(2)
    const e = events[1] as UserAddTemplateEvent
    expect(e).toBeInstanceOf(UserAddTemplateEvent)
    expect(e.aggregateId).toBe(user.id)
    expect(e.templateId).toBe(templateProps.id)
  })
  it.concurrent('should be update template', async () => {
    const testTemplate = Template.create({ name: 'test', tasks: TASKS })
    const props = {
      ...baseProps,
      templates: [testTemplate],
      password: pass
    }
    const user = new User({
      id: TEST_ID,
      props
    })
    expect(user.getProps().templates).toHaveLength(1)
    expect(user.getProps().templates[0]).toStrictEqual(testTemplate)
    const updatedTemplate = user.updateTemplate({
      templateId: testTemplate.id,
      newProps: {
        name: 'testUpdated',
        tasks: TASKS
      }
    })

    const templates = user.getProps().templates

    expect(templates[0]).toStrictEqual(updatedTemplate)
    expect(templates[0]).not.toStrictEqual(testTemplate)

    const events = user.domainEvents
    expect(events).toHaveLength(1)
    const e = events[0] as UserUpdateTemplateEvent
    expect(e).toBeInstanceOf(UserUpdateTemplateEvent)
    expect(e.aggregateId).toBe(user.id)
    expect(e.templateId).toBe(updatedTemplate.id)
    expect(e.name).toBe(updatedTemplate.getProps().name)
  })
  it.concurrent('should be remove template', async () => {
    const testTemplate = Template.create({ name: 'test', tasks: TASKS })
    const props = {
      ...baseProps,
      templates: [testTemplate],
      password: pass
    }
    const user = new User({
      id: TEST_ID,
      props
    })
    expect(user.getProps().templates).toHaveLength(1)
    expect(user.getProps().templates[0]).toStrictEqual(testTemplate)

    user.removeTemplate(testTemplate.id)
    expect(user.getProps().templates).toHaveLength(0)

    const events = user.domainEvents
    expect(events).toHaveLength(1)
    const e = events[0] as UserRemoveTemplateEvent
    expect(e).toBeInstanceOf(UserRemoveTemplateEvent)
    expect(e.aggregateId).toBe(user.id)
    expect(e.templateId).toBe(testTemplate.id)
  })
  describe.concurrent('Exceptions', () => {
    it.concurrent('User name is required', async () => {
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
    it.concurrent('Label name cannot be empty', async () => {
      try {
        const user = new User({
          id: TEST_ID,
          props: { ...baseProps, password: pass }
        })
        user.addLabel({ name: '' })
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toBe('Label name cannot be empty')
      }
    })
    it.concurrent('Template name cannot be empty', async () => {
      try {
        const user = new User({
          id: TEST_ID,
          props: { ...baseProps, password: pass }
        })
        user.addTemplate({ name: '', tasks: TASKS })
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toBe('Template name must be at least 3 characters long')
      }
    })
    it.concurrent('Template name cannot be empty', async () => {
      try {
        const user = new User({
          id: TEST_ID,
          props: { ...baseProps, password: pass }
        })
        user.addTemplate({ name: 'test', tasks: [] })
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(Error)
        expect((e as Error).message).toBe('Template must have at least one task')
      }
    })
  })
})
