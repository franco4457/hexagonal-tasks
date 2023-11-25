import request from 'supertest'

import api from '@/infraestructure/express/app'
const app = (await api).getInstance()

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
