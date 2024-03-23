import api from '../src/app'
import { MOCK_TOKEN, TEST_ID } from '@config/test/utils'
import request from 'supertest'

// FIXME: Check all test don't depend on each other
describe.concurrent('Project', async () => {
  const app = (await api).getInstance()
  it.concurrent('POST /project', async () => {
    const res = await request(app)
      .post('/api/v1/project')
      .send({
        name: 'project name'
      })
      .set('Authorization', MOCK_TOKEN)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      project: {
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        id: expect.any(String),
        pomodoroCount: 0,
        userId: TEST_ID,
        name: 'project name'
      }
    })
  })
  it.concurrent('GET /project', async () => {
    const res = await request(app).get('/api/v1/project').set('Authorization', MOCK_TOKEN)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      projects: [
        {
          name: 'project name',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          id: expect.any(String),
          pomodoroCount: 0,
          userId: TEST_ID
        }
      ]
    })
  })
})
