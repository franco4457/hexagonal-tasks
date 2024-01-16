import request from 'supertest'
import api from '@/infraestructure/express/app'
import { TEST_ID } from '../../utils/constants'
const app = (await api).getInstance()

const testTask = {
  title: 'title',
  description: 'description',
  order: 1,
  pomodoro: {
    estimated: 1
  },
  labels: [],
  userId: TEST_ID
}

describe('Task', () => {
  it.concurrent('POST /task', async () => {
    const res = await request(app).post('/api/v1/task').send(testTask)
    expect(res.status).toBe(201)
    const { task } = res.body
    expect(task).toHaveProperty('id')
    expect(task.title).toBe(testTask.title)
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([])
    expect(task.project).toBe(null)
  })
  it.concurrent('POST /task - whit project and labels', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send({
        ...testTask,
        labels: [{ name: 'label' }, { id: TEST_ID, name: 'label2' }],
        project: { name: 'project' }
      })
    expect(res.status).toBe(201)
    const { task } = res.body
    expect(task).toHaveProperty('id')
    expect(task.title).toBe(testTask.title)
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([
      { id: expect.any(String), name: 'label' },
      { id: TEST_ID, name: 'label2' }
    ])
    expect(task.project).toEqual({
      id: expect.any(String),
      name: 'project'
    })
  })
  it.concurrent('GET /task', async () => {
    const res = await request(app).get('/api/v1/task')
    expect(res.status).toBe(200)
    const { tasks } = res.body
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    expect(task).toHaveProperty('id')
    expect(task.title).toBe(testTask.title)
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([])
    expect(task.project).toBe(null)

    // second task
    expect(task2).toHaveProperty('id')
    expect(task2.title).toBe(testTask.title)
    expect(task2.isCompleted).toBe(false)
    expect(task2.description).toBe('description')
    expect(task2.userId).toBe(TEST_ID)
    expect(task2.labels).toEqual([
      { id: expect.any(String), name: 'label' },
      { id: TEST_ID, name: 'label2' }
    ])
    expect(task2.project).toEqual({
      id: expect.any(String),
      name: 'project'
    })
  })

  it.concurrent('POST /task - error missig fields', async () => {
    const res = await request(app).post('/api/v1/task').send({})
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalid Task',
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['title'],
          message: 'Title is required'
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['description'],
          message: 'Description is required'
        },
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'undefined',
          path: ['order'],
          message: 'Order is required'
        },
        {
          code: 'invalid_type',
          expected: 'object',
          received: 'undefined',
          path: ['pomodoro'],
          message: 'Pomodoro is required'
        },
        {
          code: 'invalid_type',
          expected: 'array',
          received: 'undefined',
          path: ['labels'],
          message: 'Labels is required'
        }
      ],
      errors: [
        'Title is required',
        'Description is required',
        'Order is required',
        'Pomodoro is required',
        'Labels is required'
      ],
      message: 'Invalid Task'
    })
  })
  it.concurrent('POST /task - error invalid types', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send({
        title: { title: 'title' },
        description: 20,
        order: 'one',
        pomodoro: [],
        labels: {},
        project: { name: {} },
        userId: testTask.userId
      })
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalid Task',
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'object',
          path: ['title'],
          message: "Invalid type on On 'title'. expected string, received object"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['description'],
          message: "Invalid type on On 'description'. expected string, received number"
        },
        {
          code: 'invalid_type',
          expected: 'number',
          received: 'string',
          path: ['order'],
          message: "Invalid type on On 'order'. expected number, received string"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'object',
          path: ['project', 'name'],
          message: "Invalid type on On 'project.name'. expected string, received object"
        },
        {
          code: 'invalid_type',
          expected: 'object',
          message: "Invalid type on On 'pomodoro'. expected object, received array",
          path: ['pomodoro'],
          received: 'array'
        },

        {
          code: 'invalid_type',
          expected: 'array',
          received: 'object',
          path: ['labels'],
          message: "Invalid type on On 'labels'. expected array, received object"
        }
      ],
      errors: [
        "Invalid type on On 'title'. expected string, received object",
        "Invalid type on On 'description'. expected string, received number",
        "Invalid type on On 'order'. expected number, received string",
        "Invalid type on On 'project.name'. expected string, received object",
        "Invalid type on On 'pomodoro'. expected object, received array",
        "Invalid type on On 'labels'. expected array, received object"
      ],
      message: 'Invalid Task'
    })
  })
  it.concurrent('POST /task - error invalid uuid', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send({
        ...testTask,
        userId: '123'
      })
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalid User ID',
      issues: [
        {
          validation: 'uuid',
          code: 'invalid_string',
          message:
            "User ID should be a valid UUID(something like this: 'string-string-string-string-string')",
          path: []
        }
      ],
      errors: [
        "User ID should be a valid UUID(something like this: 'string-string-string-string-string')"
      ],
      message: 'Invalid User ID'
    })
  })
  it.concurrent('POST /task - error user not found', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send({
        ...testTask,
        userId: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1b'
      })
    expect(res.status).toBe(404)
    expect(res.body).toEqual({
      error: true,
      name: 'Not Found',
      message: 'User with id: c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1b not found'
    })
  })

  it.concurrent('POST /task/bulk', async () => {
    const res = await request(app)
      .post('/api/v1/task/bulk')
      .send({
        data: [
          {
            task: {
              ...testTask,
              title: 'title1'
            },
            userId: TEST_ID
          },
          {
            task: {
              ...testTask,
              title: 'title2',
              project: { name: 'project' },
              labels: [{ name: 'label' }, { id: TEST_ID, name: 'label2' }]
            },
            userId: TEST_ID
          }
        ]
      })
    // console.log(res.body)
    expect(res.status).toBe(201)
    const { tasks } = res.body
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    expect(task).toHaveProperty('id')
    expect(task.title).toBe('title1')
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([])
    expect(task.project).toBe(null)

    // second task
    expect(task2).toHaveProperty('id')
    expect(task2.title).toBe('title2')
    expect(task2.isCompleted).toBe(false)
    expect(task2.description).toBe('description')
    expect(task2.userId).toBe(TEST_ID)
    expect(task2.labels).toEqual([
      { id: expect.any(String), name: 'label' },
      { id: TEST_ID, name: 'label2' }
    ])
    expect(task2.project).toEqual({
      id: expect.any(String),
      name: 'project'
    })
  })
})
