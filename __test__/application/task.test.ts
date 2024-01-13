import { TEST_ID } from './../utils/constants'
import { ListTasks, CreateTask } from '@/application/task'
import { ValidationError } from '@/domain/core'
import { Label, Project, Task } from '@/domain/task'
import { InMemoryTaskRepository } from '@/infraestructure/repository/in-memory'
import EventEmitter2 from 'eventemitter2'

const eventEmitter = new EventEmitter2()
const taskConfig = {
  eventEmitter,
  appContext: 'TEST'
}

const baseTask = {
  title: 'title',
  description: 'description',
  order: 1,
  labels: [],
  pomodoro: {
    estimated: 1
  }
}

describe('task', () => {
  it.concurrent('Create task', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: baseTask,
      userId: TEST_ID
    })
    expect(task).toBeInstanceOf(Task)
    const taskProps = task.getProps()
    expect(taskProps.title).toEqual('title')
    expect(taskProps.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(taskProps.userId).toBe(TEST_ID)
  })
  it.concurrent('Create task with project', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: { ...baseTask, project: { name: 'project' } },
      userId: TEST_ID
    })
    const taskProps = task.getProps()
    expect(taskProps.project).toBeInstanceOf(Project)
    expect(taskProps.project?.value.name).toBe('project')
  })
  it.concurrent('Create task with labels', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: {
        ...baseTask,
        labels: [
          { name: 'label' },
          {
            id: TEST_ID,
            name: 'label2'
          }
        ]
      },
      userId: TEST_ID
    })
    const taskProps = task.getProps()
    expect(taskProps.labels).toBeInstanceOf(Array)
    expect(taskProps.labels).toHaveLength(2)
    expect(taskProps.labels[0].value.name).toBe('label')
    expect(taskProps.labels[0]).toBeInstanceOf(Label)
    expect(taskProps.labels[0].value.id).toBeTypeOf('string')
    expect(taskProps.labels[1].value.name).toBe('label2')
    expect(taskProps.labels[1].value.id).toBe(TEST_ID)
    expect(taskProps.labels[1]).toBeInstanceOf(Label)
  })
  it.concurrent('Create task with labels and project', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: { ...baseTask, labels: [{ name: 'label' }], project: { name: 'project' } },
      userId: TEST_ID
    })
    expect(task).toBeInstanceOf(Task)
    const taskProps = task.getProps()
    expect(taskProps.title).toEqual('title')
    expect(taskProps.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(taskProps.userId).toBe(TEST_ID)
    expect(taskProps.labels).toBeInstanceOf(Array)
    expect(taskProps.labels).toHaveLength(1)
    expect(taskProps.labels[0].value.name).toBe('label')
    expect(taskProps.project).toBeInstanceOf(Project)
    expect(taskProps.project?.value.name).toBe('project')
  })
  it.concurrent('Create multiple task', async () => {
    const taskRepository = new InMemoryTaskRepository(taskConfig)
    const createTask = new CreateTask(taskRepository)
    const tasks = await createTask.create(
      Array.from({ length: 10 }, (_, i) => i).map((i) => ({
        task: { ...baseTask, title: `test-title-${i}`, description: `test-desc-${i}` },
        userId: TEST_ID.slice(0, -1) + i
      }))
    )
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(10)
    tasks.forEach((task, i) => {
      expect(task).toBeInstanceOf(Task)
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(TEST_ID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
    })
  })
  it.concurrent('Create multiple task with project and labels', async () => {
    const taskRepository = new InMemoryTaskRepository(taskConfig)
    const createTask = new CreateTask(taskRepository)
    const tasks = await createTask.create(
      Array.from({ length: 3 }, (_, i) => i).map((i) => ({
        task: {
          ...baseTask,
          title: `test-title-${i}`,
          description: `test-desc-${i}`,
          labels: [
            { name: 'label' },
            {
              id: TEST_ID,
              name: 'label2'
            }
          ],
          project: { name: 'project' }
        },
        userId: TEST_ID.slice(0, -1) + i
      }))
    )
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(3)
    tasks.forEach((task, i) => {
      expect(task).toBeInstanceOf(Task)
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(TEST_ID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
      expect(taskProps.labels[0].value.name).toBe('label')
      expect(taskProps.labels[0]).toBeInstanceOf(Label)
      expect(taskProps.labels[0].value.id).toBeTypeOf('string')
      expect(taskProps.labels[1].value.name).toBe('label2')
      expect(taskProps.labels[1].value.id).toBe(TEST_ID)
      expect(taskProps.labels[1]).toBeInstanceOf(Label)
      expect(taskProps.project).toBeInstanceOf(Project)
      expect(taskProps.project?.value.name).toBe('project')
    })
  })
  it.concurrent('On create task should be publish event', async () => {
    const taskRepository = new InMemoryTaskRepository(taskConfig)
    const createTask = new CreateTask(taskRepository)
    let exec = false
    eventEmitter.on('TaskCreateEvent', (event) => {
      exec = true
      expect(event).toBeInstanceOf(Object)
      expect(event).toHaveProperty('userId')
    })
    const task = await createTask.create({
      task: baseTask,
      userId: TEST_ID
    })
    await task.publishEvents(eventEmitter, console)
    expect(task).toBeInstanceOf(Task)
    expect(exec).toBe(true)
  })
  it.concurrent('List task', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new CreateTask(taskRepository)
    await createTask.create(
      Array.from({ length: 10 }, (_, i) => i).map((i) => ({
        task: { ...baseTask, title: `test-title-${i}`, description: `test-desc-${i}` },
        userId: TEST_ID.slice(0, -1) + i
      }))
    )
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getAll()
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(10)
    tasks.forEach((task, i) => {
      expect(task).toBeInstanceOf(Task)
      const taskProps = task.getProps()
      expect(taskProps.title).toBe(`test-title-${i}`)
      expect(taskProps.description).toBe(`test-desc-${i}`)
      expect(taskProps.userId).toBe(TEST_ID.slice(0, -1) + i)
      expect(task.id).toBeTypeOf('string')
    })
  })
  it.concurrent('List task by user id', async () => {
    const taskRepository = new InMemoryTaskRepository({
      ...taskConfig
    })
    const createTask = new CreateTask(taskRepository)
    await Promise.all([
      await createTask.create(
        Array.from({ length: 10 }, (_, i) => i).map((i) => ({
          task: { ...baseTask, title: `test-title-${i}`, description: `test-desc-${i}` },
          userId: TEST_ID.slice(0, -1) + i
        }))
      ),
      createTask.create({
        task: { ...baseTask, title: 'test-title-10', description: 'test-desc-10' },
        userId: TEST_ID.slice(0, -1) + 0
      })
    ])
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getByUserId(TEST_ID.slice(0, -1) + 0)
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    const taskP = task.getProps()
    const taskP2 = task2.getProps()
    expect(task).toBeInstanceOf(Task)
    expect(taskP.title).toBe('test-title-0')
    expect(taskP.description).toBe('test-desc-0')
    expect(taskP.userId).toBe(TEST_ID.slice(0, -1) + 0)
    expect(task.id).toBeTypeOf('string')
    expect(task2).toBeInstanceOf(Task)
    expect(taskP2.title).toBe('test-title-10')
    expect(taskP2.description).toBe('test-desc-10')
    expect(taskP2.userId).toBe(TEST_ID.slice(0, -1) + 0)
    expect(task2.id).toBeTypeOf('string')
  })

  describe.concurrent('Exceptions', () => {
    it.concurrent('Don`t send correct props', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new CreateTask(taskRepository)
      await expect(
        createTask.create({
          // @ts-expect-error test
          task: {},
          userId: TEST_ID
        })
      ).rejects.toThrowError(
        '["Title is required","Description is required","Order is required","Labels is required"]'
      )
    })
    it.concurrent('Don`t send correct types ', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new CreateTask(taskRepository)
      try {
        await createTask.create({
          // @ts-expect-error test
          task: {
            title: 0,
            description: 0,
            labels: 'foo',
            order: 'bar',
            project: {
              name: {},
              id: 'foo'
            },
            pomodoro: 'baz'
          },
          userId: TEST_ID
        })
        expect(true).toBe(false)
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError)
        const e = error as ValidationError
        expect(e.message).toBe(
          '["Invalid type on On \'title\'. expected string, received number","Invalid type on On \'description\'. expected string, received number","Invalid type on On \'order\'. expected number, received string","Invalid project id","Invalid type on On \'project.name\'. expected string, received object","Invalid type on On \'labels\'. expected array, received string"]'
        )
      }
    })
    it.concurrent('Don`t send correct lengths', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new CreateTask(taskRepository)
      await expect(
        createTask.create({
          task: {
            ...baseTask,
            order: -1,
            title: 't',
            description: 'd'
          },
          userId: TEST_ID
        })
      ).rejects.toThrowError(
        '["Title should be at least 3 characters","Description should be at least 3 characters","Order should be equals or greater than 0"]'
      )
    })
    it.concurrent('Don`t correct userId', async () => {
      const taskRepository = new InMemoryTaskRepository(taskConfig)
      const createTask = new CreateTask(taskRepository)
      await expect(
        createTask.create({
          task: {
            ...baseTask,
            title: 'title',
            description: 'description'
          },
          userId: 'asdjkah-asldjkh'
        })
      ).rejects.toThrowError(
        '["User ID should be a valid UUID(something like this: \'string-string-string-string-string\')"]'
      )
    })
  })
})
