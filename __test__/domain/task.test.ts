import { ListTasks } from './../../src/application/task/list-tasks'
import { CreateTask } from '@/application/task/task-create'
import { Task } from '@/domain/task'
import { InMemoryTaskRepository } from '@/infraestructure/repsitory/in-memory'

describe('task', () => {
  it.concurrent('Create task', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    const task = await createTask.create({
      task: { title: 'title', description: 'description' },
      userId: 'userId'
    })
    expect(task).toBeInstanceOf(Task)
    expect(task.title).toEqual('title')
    expect(task.description).toEqual('description')
    expect(task.id).toBeTypeOf('string')
    expect(task.userId).toBe('userId')
  })
  it.concurrent('List task', async () => {
    const taskRepository = new InMemoryTaskRepository()
    const createTask = new CreateTask(taskRepository)
    await Promise.all(
      Array.from({ length: 10 }, (_, i) => i).map(
        async (i) =>
          await createTask.create({
            task: { title: `test-title-${i}`, description: `test-desc-${i}` },
            userId: `userId-${i}`
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
      expect(task.userId).toBe(`userId-${i}`)
    })
  })
})