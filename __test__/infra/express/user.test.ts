import request from 'supertest'

import api from '@/infraestructure/express/app'
const app = (await api).getInstance()
const testUser = {
  email: 'test@email.com',
  name: 'test1',
  lastname: 'tester2',
  username: 'tested1'
}
const testLogin = {
  email: 'example@mail.com',
  password: 'Pass1234'
}
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
    const res = await request(app).post('/api/v1/user/login').send(testLogin)
    expect(res.status).toBe(200)
    const { user } = res.body
    expect(user).toHaveProperty('id')
    expect(user).toHaveProperty('name')
    expect(user).toHaveProperty('email')
    expect(user).toHaveProperty('lastname')
    expect(user).toHaveProperty('username')
    expect(user).not.toHaveProperty('password')
  })
  it('POST /user/login - error not found user', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({ ...testLogin, email: 'lalala' })
    expect(res.status).toBe(404)
    expect(res.body).toEqual({
      error: true,
      name: 'Not Found',
      message: 'User with email: lalala not found'
    })
  })
  it.concurrent('POST /user/login - error invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/user/login')
      .send({ ...testLogin, password: 'invalid' })
    // should throw same error to avoid security issues
    expect(res.status).toBe(404)
    expect(res.body).toEqual({
      error: true,
      name: 'Not Found',
      message: 'User with email: example@mail.com not found'
    })
    // check if only password is invalid
    expect((await request(app).post('/api/v1/user/login').send(testLogin)).status).toBe(200)
  })
  it.concurrent('POST /user/register', async () => {
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({ password: 'Pass1234', ...testUser })
    expect(res.status).toBe(200)
    const {
      user: { id, createdAt, updatedAt, ...user }
    } = res.body
    expect(id).toBeDefined()
    expect(createdAt).toBeDefined()
    expect(updatedAt).toBeDefined()
    expect(user).toEqual(testUser)
  })
  it.concurrent('POST /user/register - error missing fields', async () => {
    const res = await request(app).post('/api/v1/user/register').send({})
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalid user',
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['name'],
          message: 'Name is required'
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['lastname'],
          message: 'Lastname is required'
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['username'],
          message: 'Username is required'
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['email'],
          message: 'Email is required'
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['password'],
          message: 'Password is required'
        }
      ],
      errors: [
        'Name is required',
        'Lastname is required',
        'Username is required',
        'Email is required',
        'Password is required'
      ],
      message: 'Invalid user'
    })
  })
  it.concurrent('POST /user/register - error invalid types', async () => {
    const res = await request(app).post('/api/v1/user/register').send({
      name: 1,
      lastname: {},
      username: 10,
      email: [],
      password: 11.5
    })
    expect(res.status).toBe(422)
    expect(res.body).toEqual({
      error: true,
      name: 'Invalid user',
      issues: [
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: "Invalid type on On 'name'. expected string, received number"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'object',
          path: ['lastname'],
          message: "Invalid type on On 'lastname'. expected string, received object"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['username'],
          message: "Invalid type on On 'username'. expected string, received number"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'array',
          path: ['email'],
          message: "Invalid type on On 'email'. expected string, received array"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['password'],
          message: "Invalid type on On 'password'. expected string, received number"
        }
      ],
      errors: [
        "Invalid type on On 'name'. expected string, received number",
        "Invalid type on On 'lastname'. expected string, received object",
        "Invalid type on On 'username'. expected string, received number",
        "Invalid type on On 'email'. expected string, received array",
        "Invalid type on On 'password'. expected string, received number"
      ],
      message: 'Invalid user'
    })
  })
  it.concurrent('POST /user/register - error user already exist', async () => {
    await request(app)
      .post('/api/v1/user/register')
      .send({ password: 'Pass1234', ...testUser, email: 'test2@email.com' })
    const res = await request(app)
      .post('/api/v1/user/register')
      .send({ password: 'Pass1234', ...testUser, email: 'test2@email.com' })
    expect(res.status).toBe(409)
    expect(res.body).toEqual({
      error: true,
      name: 'Already exist',
      message: 'User with email: test2@email.com already exist'
    })
  })
})
