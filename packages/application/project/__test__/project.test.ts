import { InMemoryProjectRepository } from '@infrastructure/repository-in-memory'
import { REPO_CONFIG, TEST_ID } from '@config/test/utils'
import {
  ProjectCreateCommand,
  ProjectCreateService,
  ProjectAddPomodoroCountEventHandler
} from '../src'
import { InvalidProject, Project, type ProjectRepository } from '@domain/project'
import { TaskUpdateActualPomodoroEvent } from '@domain/task'

describe.concurrent('Project', () => {
  it.concurrent('Create project', async () => {
    const inMemoryProjectRepository = new InMemoryProjectRepository(
      REPO_CONFIG
    ) as ProjectRepository
    const createProject = new ProjectCreateService(inMemoryProjectRepository)
    const project = await createProject.execute(
      new ProjectCreateCommand({
        name: 'Project name',
        userId: TEST_ID
      })
    )
    expect(project).toBeInstanceOf(Project)
    expect(project.getProps()).toEqual({
      id: expect.any(String),
      name: 'Project name',
      userId: TEST_ID,
      pomodoroCount: 0,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    })
    const projectFromRepository = await inMemoryProjectRepository.getById(project.id)
    expect(projectFromRepository).toEqual(project)
  })
  it.concurrent('Sum pomodoro count handler', async () => {
    const inMemoryProjectRepository = new InMemoryProjectRepository(REPO_CONFIG)
    await inMemoryProjectRepository.create(
      new Project({
        id: TEST_ID,
        props: {
          name: 'Project name',
          userId: TEST_ID,
          pomodoroCount: 0
        }
      })
    )
    const handler = new ProjectAddPomodoroCountEventHandler({
      projectRepository: inMemoryProjectRepository
    })
    await handler.handle(
      new TaskUpdateActualPomodoroEvent({
        aggregateId: TEST_ID,
        userId: TEST_ID,
        projectName: 'Project name',
        actual: 1,
        estimated: 2
      })
    )
    const project = await inMemoryProjectRepository.getById(TEST_ID)
    expect(project.getProps().pomodoroCount).toBe(1)
  })
  describe.concurrent('Exceptions', async () => {
    it.concurrent('Incorrect props on create', async () => {
      const inMemoryProjectRepository = new InMemoryProjectRepository(
        REPO_CONFIG
      ) as ProjectRepository
      const createProject = new ProjectCreateService(inMemoryProjectRepository)
      try {
        await createProject.execute(new ProjectCreateCommand({ name: '', userId: '' }))
        expect(true).toBe(false)
      } catch (e) {
        expect((e as Error).message).toBe(
          '["Name should be at least 3 characters","Invalid userId"]'
        )
        expect(e).toBeInstanceOf(InvalidProject)
      }
    })
    it.concurrent('Incorrect types props on create', async () => {
      const inMemoryProjectRepository = new InMemoryProjectRepository(
        REPO_CONFIG
      ) as ProjectRepository
      const createProject = new ProjectCreateService(inMemoryProjectRepository)
      try {
        // @ts-expect-error Testing incorrect types
        await createProject.execute(new ProjectCreateCommand({ name: 1, userId: {} }))
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(InvalidProject)
        expect((e as Error).message).toBe(
          '["Invalid type on \'name\'. expected string, received number","Invalid type on \'userId\'. expected string, received object"]'
        )
      }
    })
    it.concurrent('Incorrect project name on sum pomodoro count', async () => {
      const inMemoryProjectRepository = new InMemoryProjectRepository(REPO_CONFIG)
      const handler = new ProjectAddPomodoroCountEventHandler({
        projectRepository: inMemoryProjectRepository
      })
      try {
        await handler.handle(
          new TaskUpdateActualPomodoroEvent({
            aggregateId: TEST_ID,
            userId: TEST_ID,
            projectName: 'missing-project',
            actual: 1,
            estimated: 2
          })
        )
        expect(true).toBe(false)
      } catch (e) {
        // FIXME: This is not working buecause the test don't have the same instance of the class
        // expect(e).toBeInstanceOf(ProjectNotFound)
        expect((e as Error).message).toBe('Project with name: missing-project not found')
      }
    })
  })
})
