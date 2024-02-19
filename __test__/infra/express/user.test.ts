import request from 'supertest'

import api from '@/infraestructure/express/app'
import { TEST_ID } from '../../utils'
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

const testTemplate = {
  name: 'test',
  tasks: [
    {
      name: 'test',
      description: 'test',
      order: 1,
      pomodoroEstimated: 1,
      projectId: null
    }
  ]
}
// TODO: Check all test don't depend on each other
describe.concurrent('User', async () => {
  const app = (await api).getInstance()
  it.concurrent('GET /user/all', async () => {
    const res = await request(app).get('/api/v1/user/all')

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
    const {
      body: { token }
    } = await request(app).post('/api/v1/user/login').send(testLogin)
    const res = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${token}`)
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
    const {
      body: { token }
    } = await request(app)
      .post('/api/v1/user/register')
      .send({ password: 'Pass1234', ...testUser })

    const res = await request(app).get('/api/v1/user').set('Authorization', `Bearer ${token}`)
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
          message: "Invalid type on 'name'. expected string, received number"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'object',
          path: ['lastname'],
          message: "Invalid type on 'lastname'. expected string, received object"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['username'],
          message: "Invalid type on 'username'. expected string, received number"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'array',
          path: ['email'],
          message: "Invalid type on 'email'. expected string, received array"
        },
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['password'],
          message: "Invalid type on 'password'. expected string, received number"
        }
      ],
      errors: [
        "Invalid type on 'name'. expected string, received number",
        "Invalid type on 'lastname'. expected string, received object",
        "Invalid type on 'username'. expected string, received number",
        "Invalid type on 'email'. expected string, received array",
        "Invalid type on 'password'. expected string, received number"
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

  describe.concurrent('User/Label', async () => {
    let token = ''
    beforeAll(async () => {
      const {
        body: { token: t }
      } = await request(app).post('/api/v1/user/login').send(testLogin)
      token = t
    })
    it.concurrent('GET /user/label', async () => {
      const res = await request(app)
        .get('/api/v1/user/label')
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ labels: [] })
    })
    it.concurrent('POST /user/label', async () => {
      const res = await request(app)
        .post('/api/v1/user/label')
        .send({ name: 'test' })
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(201)
      expect(res.body).toEqual({
        label: {
          id: expect.any(String),
          name: 'test',
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      })
      const res2 = await request(app)
        .get('/api/v1/user/label')
        .set('Authorization', 'Bearer ' + token)
      expect(res2.status).toBe(200)
      expect(res2.body).toEqual({
        labels: [
          {
            id: expect.any(String),
            name: 'test',
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          }
        ]
      })
    })

    // XXX: this test depends on the previous one
    it.concurrent('DELETE /user/label/:id', async () => {
      const res1 = await request(app)
        .get('/api/v1/user/label')
        .set('Authorization', 'Bearer ' + token)
      const labelId = res1.body.labels[0].id
      const res = await request(app)
        .delete(`/api/v1/user/label/${labelId}`)
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(201)

      const res2 = await request(app)
        .get('/api/v1/user/label')
        .set('Authorization', 'Bearer ' + token)
      expect(res2.body).toEqual({ labels: [] })
    })
    it.concurrent('POST /user/label - error missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/user/label')
        .send({})
        .set('Authorization', 'Bearer ' + token)
      // expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid label',
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['name'],
            message: 'Name is required'
          }
        ],
        errors: ['Name is required'],
        message: 'Invalid label'
      })
    })
  })
  describe.concurrent('User/Template', async () => {
    // Token used for all test
    let token = ''
    beforeAll(async () => {
      const {
        body: { token: t }
      } = await request(app).post('/api/v1/user/login').send(testLogin)
      token = t
    })
    it.concurrent('GET /user/template', async () => {
      const res = await request(app)
        .get('/api/v1/user/template')
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(200)
      expect(res.body).toEqual({ templates: [] })
    })
    it.concurrent('POST /user/template', async () => {
      const res = await request(app)
        .post('/api/v1/user/template')
        .send(testTemplate)
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(201)
      expect(res.body).toEqual({
        template: {
          id: expect.any(String),
          name: 'test',
          tasks: [
            {
              name: 'test',
              description: 'test',
              order: 1,
              pomodoroEstimated: 1,
              projectId: null
            }
          ],
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      })
    })
    it('PUT /user/template', async () => {
      const res1 = await request(app)
        .get('/api/v1/user/template')
        .set('Authorization', 'Bearer ' + token)
      const templateId = res1.body.templates[0].id
      const res = await request(app)
        .put('/api/v1/user/template')
        .send({
          name: 'updated-template',
          id: templateId,
          tasks: [
            {
              name: 'updated-template-taskName',
              description: 'updated-template-taskDescription',
              order: 2,
              pomodoroEstimated: 3,
              projectId: TEST_ID
            }
          ]
        })
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(201)

      const res2 = await request(app)
        .get('/api/v1/user/template')
        .set('Authorization', 'Bearer ' + token)
      const template = res2.body.templates.find((t: any) => t.id === templateId)
      expect(template).toEqual({
        id: templateId,
        name: 'updated-template',
        tasks: [
          {
            name: 'updated-template-taskName',
            description: 'updated-template-taskDescription',
            order: 2,
            pomodoroEstimated: 3,
            projectId: TEST_ID
          }
        ],
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })
    it('DELETE /user/template/:id', async () => {
      const res1 = await request(app)
        .post('/api/v1/user/template')
        .send(testTemplate)
        .set('Authorization', 'Bearer ' + token)
      const templateId = res1.body.template.id

      const res = await request(app)
        .delete(`/api/v1/user/template/${templateId}`)
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(201)

      const res2 = await request(app)
        .get('/api/v1/user/template')
        .set('Authorization', 'Bearer ' + token)
      expect(res2.status).toBe(200)
      expect(res2.body.templates.length).toBeGreaterThanOrEqual(0)
      const template = res2.body.templates.find((t: any) => t.id === templateId)
      expect(template).toBeUndefined()
    })
    it.concurrent('POST /user/template - error missing fields', async () => {
      const res = await request(app)
        .post('/api/v1/user/template')
        .send({})
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid template',
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
            expected: 'array',
            received: 'undefined',
            path: ['tasks'],
            message: 'Tasks are required'
          }
        ],
        errors: ['Name is required', 'Tasks are required'],
        message: 'Invalid template'
      })
    })
    it.concurrent('POST /user/template - error invalid types', async () => {
      const res = await request(app)
        .post('/api/v1/user/template')
        .send({ name: 1, tasks: 1 })
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid template',
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            path: ['name'],
            message: "Invalid type on 'name'. expected string, received number"
          },
          {
            code: 'invalid_type',
            expected: 'array',
            received: 'number',
            path: ['tasks'],
            message: "Invalid type on 'tasks'. expected array, received number"
          }
        ],
        errors: [
          "Invalid type on 'name'. expected string, received number",
          "Invalid type on 'tasks'. expected array, received number"
        ],
        message: 'Invalid template'
      })
    })
    it.concurrent('POST /user/template - error invalid tasks requireds', async () => {
      const res = await request(app)
        .post('/api/v1/user/template')
        .send({ name: 'test', tasks: [{}] })
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid template',
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['tasks', 0, 'name'],
            message: 'Name is required'
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['tasks', 0, 'description'],
            message: 'Description is required'
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['tasks', 0, 'order'],
            message: 'Order is required'
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['tasks', 0, 'pomodoroEstimated'],
            message: 'Pomodoro estimated is required'
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['tasks', 0, 'projectId'],
            message: 'Project id is required'
          }
        ],
        errors: [
          'Name is required',
          'Description is required',
          'Order is required',
          'Pomodoro estimated is required',
          'Project id is required'
        ],
        message: 'Invalid template'
      })
    })
    it.concurrent('POST /user/template - error invalid tasks types', async () => {
      const res = await request(app)
        .post('/api/v1/user/template')
        .send({
          name: 'test',
          tasks: [
            {
              name: 1,
              description: [],
              order: {},
              pomodoroEstimated: '1',
              projectId: {}
            }
          ]
        })
        .set('Authorization', 'Bearer ' + token)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid template',
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            path: ['tasks', 0, 'name'],
            message: "Invalid type on 'tasks[0].name'. expected string, received number"
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'array',
            path: ['tasks', 0, 'description'],
            message: "Invalid type on 'tasks[0].description'. expected string, received array"
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'object',
            path: ['tasks', 0, 'order'],
            message: "Invalid type on 'tasks[0].order'. expected number, received object"
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'string',
            path: ['tasks', 0, 'pomodoroEstimated'],
            message:
              "Invalid type on 'tasks[0].pomodoroEstimated'. expected number, received string"
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'object',
            path: ['tasks', 0, 'projectId'],
            message: "Invalid type on 'tasks[0].projectId'. expected string, received object"
          }
        ],
        errors: [
          "Invalid type on 'tasks[0].name'. expected string, received number",
          "Invalid type on 'tasks[0].description'. expected string, received array",
          "Invalid type on 'tasks[0].order'. expected number, received object",
          "Invalid type on 'tasks[0].pomodoroEstimated'. expected number, received string",
          "Invalid type on 'tasks[0].projectId'. expected string, received object"
        ],
        message: 'Invalid template'
      })
    })
  })
})
