import request from 'supertest'

import api from '@/infraestructure/express/app'
const app = api.getInstance()

describe('Task', () => {
  it.concurrent('POST /task', async () => {
    const res = await request(app).post('/api/v1/task').send({
      title: 'title',
      description: 'description',
      userId: 'asd'
    })
    expect(res.status).toBe(201)
    const { task } = res.body
    expect(task).toHaveProperty('id')
    expect(task).toHaveProperty('title')
    expect(task).toHaveProperty('description')
    expect(task).toHaveProperty('userId')
  })
})
