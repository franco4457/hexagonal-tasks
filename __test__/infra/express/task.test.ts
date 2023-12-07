import request from 'supertest'

import api from '@/infraestructure/express/app'
const app = (await api).getInstance()

const testTask = {
  title: 'title',
  description: 'description',
  userId: 'c2d7e0e0-4e0a-4b7a-8c7e-2a9a9b0a3b1a'
}

describe('Task', () => {
  it.concurrent('POST /task', async () => {
    const res = await request(app).post('/api/v1/task').send(testTask)
    expect(res.status).toBe(201)
    const { task } = res.body
    expect(task).toHaveProperty('id')
    expect(task).toHaveProperty('title')
    expect(task).toHaveProperty('description')
    expect(task).toHaveProperty('userId')
  })
  it.concurrent('POST /task - error missig fields', async () => {
    const res = await request(app).post('/api/v1/task').send({})
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalida Task',
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
        }
      ],
      errors: ['Title is required', 'Description is required'],
      message: 'Invalida Task'
    })
  })
  it.concurrent('POST /task - error invalid types', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send({
        title: { title: 'title' },
        description: 20,
        userId: testTask.userId
      })
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalida Task',
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'object',
          path: ['title'],
          message: 'Expected string, received object'
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['description'],
          message: 'Expected string, received number'
        }
      ],
      errors: ['Expected string, received object', 'Expected string, received number'],
      message: 'Invalida Task'
    })
  })
  it.concurrent('POST /task - error invalid uuid', async () => {
    const res = await request(app).post('/api/v1/task').send({
      title: 'title',
      description: 'description',
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
  it.concurrent('GET /task', async () => {
    const res = await request(app).get('/api/v1/task')
    expect(res.status).toBe(200)
    const { tasks } = res.body
    expect(tasks).toHaveLength(1)
    expect(tasks[0]).toHaveProperty('id')
    expect(tasks[0]).toHaveProperty('title')
    expect(tasks[0]).toHaveProperty('description')
    expect(tasks[0]).toHaveProperty('userId')
  })
})
