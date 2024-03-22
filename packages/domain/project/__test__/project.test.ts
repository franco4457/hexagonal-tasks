import { Project, ProjectCreateEvent, ProjectSumPomodoroCountEvent } from '../src'
import { ValidationError } from '@domain/core'
import { TEST_ID } from '@config/test/utils'

const TEST_PROPS = {
  name: 'Project name',
  userId: TEST_ID
}

describe.concurrent('Project Domain', () => {
  it.concurrent('Should create a project intance', async () => {
    const project = new Project({
      id: TEST_ID,
      props: {
        ...TEST_PROPS,
        pomodoroCount: 0
      }
    })
    expect(project).toBeInstanceOf(Project)
    expect(project.id).toBe(TEST_ID)
    expect(project.createdAt).toBeInstanceOf(Date)
    expect(project.updatedAt).toBeInstanceOf(Date)
  })
  it.concurrent('Should create a Project with create method', async () => {
    const project = Project.create(TEST_PROPS)
    const now = project.createdAt
    expect(project).toBeInstanceOf(Project)
    expect(project.getProps()).toStrictEqual({
      ...TEST_PROPS,
      pomodoroCount: 0,
      id: project.id,
      createdAt: now,
      updatedAt: now
    })
  })

  it.concurrent('Should add event on create', async () => {
    const project = Project.create(TEST_PROPS)
    const events = project.domainEvents
    expect(events).toHaveLength(1)
    const e = events[0] as ProjectCreateEvent
    expect(e).toBeInstanceOf(ProjectCreateEvent)
    expect(e.aggregateId).toBe(project.id)
    expect(e.name).toBe(project.getProps().name)
    expect(e.userId).toBe(TEST_ID)
  })
  it.concurrent('Should sum pomodoro count', async () => {
    const project = Project.create(TEST_PROPS)
    expect(project.getProps().pomodoroCount).toBe(0)
    project.sumPomodoroCount()
    expect(project.getProps().pomodoroCount).toBe(1)
    expect(project.domainEvents).toHaveLength(2)
    const e = project.domainEvents[1] as ProjectSumPomodoroCountEvent
    expect(e).toBeInstanceOf(ProjectSumPomodoroCountEvent)
    expect(e.aggregateId).toBe(project.id)
    expect(e.actCounter).toBe(1)
  })
  describe.concurrent('Exceptions', () => {
    it.concurrent('Should throw error on create with empty name', async () => {
      try {
        Project.create({ name: '', userId: TEST_ID })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as Error).message).toBe('Project name must be at least 3 characters long')
      }
    })
    it.concurrent('Should throw error on create with empty userId', async () => {
      try {
        Project.create({ name: 'test', userId: '' })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as Error).message).toBe('Project userId must be at least 3 characters long')
      }
    })
    it.concurrent('Should throw error on create with negative pomodoroCount', async () => {
      try {
        // eslint-disable-next-line no-new
        new Project({
          id: TEST_ID,
          props: { name: 'test', userId: TEST_ID, pomodoroCount: -1 }
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        expect((error as Error).message).toBe('Project pomodoroCount must be greater than 0')
      }
    })
  })
})
