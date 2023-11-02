import request from 'supertest'

import api from '@/infraestructure/express/app'
const app = api.getInstance()

describe('Health', () => {
  it.concurrent('GET', async () => {
    const response = await request(app).get('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it.concurrent('POST', async () => {
    const response = await request(app).post('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it.concurrent('PUT', async () => {
    const response = await request(app).put('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it.concurrent('PATCH', async () => {
    const response = await request(app).patch('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it.concurrent('DELETE', async () => {
    const response = await request(app).delete('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
})
