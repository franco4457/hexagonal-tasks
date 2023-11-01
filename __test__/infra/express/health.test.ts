import request from 'supertest'

import app from '@/infraestructure/express/app'

describe('Health', () => {
  it('GET', async () => {
    const response = await request(app).get('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it('POST', async () => {
    const response = await request(app).post('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it('PUT', async () => {
    const response = await request(app).put('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it('PATCH', async () => {
    const response = await request(app).patch('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
  it('DELETE', async () => {
    const response = await request(app).delete('/api/v1/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ message: 'OK' })
  })
})
