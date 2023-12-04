import { ListTasks } from './../../src/application/task/list-tasks'
import { CreateTask } from '@/application/task/task-create'
import { Task } from '@/domain/task'
import { InMemoryTaskRepository } from '@/infraestructure/repsitory/in-memory'
import { randomUUID } from 'node:crypto'

const testUUID = randomUUID()

describe('task', () => {
  it.concurrent('Create task', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: { title: 'title', description: 'description' },
      userId: testUUID
    })
    expect(task).toBeInstanceOf(Task)
    expect(task.title).toEqual('title')
    expect(task.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(task.userId).toBe(testUUID)
  })
  it.concurrent('List task', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await Promise.all(
      Array.from({ length: 10 }, (_, i) => i).map(
        async (i) =>
          await createTask.create({
            task: { title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: testUUID.slice(0, -1) + i
          })
      )
    )
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getAll()
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(10)
    tasks.forEach((task, i) => {
      expect(task).toBeInstanceOf(Task)
      expect(task.title).toBe(`test-title-${i}`)
      expect(task.description).toBe(`test-desc-${i}`)
      expect(task.id).toBeTypeOf('string')
      expect(task.userId).toBe(testUUID.slice(0, -1) + i)
    })
  })
  it.concurrent('List task by user id', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await Promise.all([
      ...Array.from({ length: 10 }, (_, i) => i).map(
        async (i) =>
          await createTask.create({
            task: { title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: testUUID.slice(0, -1) + i
          })
      ),
      createTask.create({
        task: { title: 'test-title-10', description: 'test-desc-10' },
        userId: testUUID.slice(0, -1) + 0
      })
    ])
    const listTasks = new ListTasks(taskRepository)
    const tasks = await listTasks.getByUserId(testUUID.slice(0, -1) + 0)
    expect(tasks).toBeInstanceOf(Array)
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    expect(task).toBeInstanceOf(Task)
    expect(task.title).toBe('test-title-0')
    expect(task.description).toBe('test-desc-0')
    expect(task.id).toBeTypeOf('string')
    expect(task.userId).toBe(testUUID.slice(0, -1) + 0)
    expect(task2).toBeInstanceOf(Task)
    expect(task2.title).toBe('test-title-10')
    expect(task2.description).toBe('test-desc-10')
    expect(task2.id).toBeTypeOf('string')
    expect(task2.userId).toBe(testUUID.slice(0, -1) + 0)
  })
  it.concurrent('should throw error when create task don`t send correct ', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        // @ts-expect-error test
        task: {},
        userId: testUUID
      })
    ).rejects.toThrowError('["Title is required","Description is required"]')
  })
  it('should throw error when create task don`t send correct types ', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        task: {
          // @ts-expect-error test
          title: 0,
          // @ts-expect-error test
          description: 0
        },
        userId: testUUID
      })
    ).rejects.toThrowError(
      '["Expected string, received number","Expected string, received number"]'
    )
  })
  it('should throw error when create task don`t send correct lengths', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        task: {
          title: 't',
          description: 'd'
        },
        userId: testUUID
      })
    ).rejects.toThrowError(
      '["Title should be at least 3 characters","Description should be at least 3 characters"]'
    )
  })
  it('should throw error when create task don`t incorrect userId', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await expect(
      createTask.create({
        task: {
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
