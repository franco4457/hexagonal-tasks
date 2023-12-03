import request from 'supertest'

import api from '@/infraestructure/express/app'
const app = (await api).getInstance()

describe('User', () => {
  it.concurrent('GET /user', async () => {
    const res = await request(app).get('/api/v1/user')
    expect(res.status).toBe(200)
    expect(res.body.users.length).toBeGreaterThan(0)
    expect(res.body.users[0]).toHaveProperty('id')
    expect(res.body.users[0]).toHaveProperty('name')
    expect(res.body.users[0]).toHaveProperty('email')
    expect(res.body.users[0]).toHaveProperty('lastname')
    expect(res.body.users[0]).toHaveProperty('username')
    expect(res.body.users[0]).not.toHaveProperty('password')
  })
  it.concurrent('POST /user/login', async () => {
    const res = await request(app).post('/api/v1/user/login').send({
      email: 'example@mail.com',
      password: 'Pass1234'
    })
    expect(res.status).toBe(200)
    const { user } = res.body
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('lastname')
    expect(user).toHaveProperty('username')
    expect(user).not.toHaveProperty('password')
  })
  it.concurrent('POST /user/register', async () => {
    const testUser = {
      email: 'test@email.com',
      name: 'test1',
      lastname: 'tester2',
      username: 'tested1'
    }
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({ password: 'Pass1234', ...testUser })
    expect(res.status).toBe(200)
    const {
      user: { id, ...user }
    } = res.body
    expect(id).toBeDefined()
    expect(user).toEqual(testUser)
  })
})
