import request from 'supertest'
import api from '@/infraestructure/express/app'

describe.concurrent('Timer', async () => {
  const app = (await api).getInstance()
  let counterId = 0
  const createToken = async (): Promise<string> => {
    return await request(app)
      .post('/api/v1/user/register')
      .send({
        email: `test${counterId++}@email.com`,
        name: 'test1',
        lastname: 'tester2',
        username: 'tested1',
        password: 'Pass1234'
      })
      .then((res) => res.body.token)
  }
  it.concurrent('GET /timer', async () => {
    const now = Date.now()
    const token = await createToken()
    const res = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    const timer = res.body.timer
    expect(timer).toHaveProperty('id')
    expect(timer).toHaveProperty('userId')
    expect(timer).toHaveProperty('createdAt')
    expect(timer).toHaveProperty('updatedAt')
    expect(timer.status).toBe('READY')
    expect(timer.currentStage).toBe('pomodoro')
    expect(timer.fullDuration).toBe(25 * 60 * 1000)
    expect(timer.duration).toBeGreaterThanOrEqual(now)
    expect(timer.stageInterval).toBe(4)
  })
  it.concurrent('PUT /start', async () => {
    const token = await createToken()
    const res = await request(app)
      .put('/api/v1/timer/start')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(204)

    const { body } = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const timer = body.timer
    expect(timer.status).toBe('RUNNING')
    expect(Date.now() + timer.fullDuration).toBeGreaterThanOrEqual(timer.duration)
    expect(timer.pomodoroCounter).toBe(0)
    expect(timer.currentStage).toBe('pomodoro')
  })
  it.concurrent('PUT /stop', async () => {
    const token = await createToken()
    await request(app).put('/api/v1/timer/start').set('Authorization', `Bearer ${token}`)
    const res = await request(app).put('/api/v1/timer/stop').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)

    const { body } = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const timer = body.timer
    expect(timer.status).toBe('PAUSED')
  })

  it.concurrent('PUT /resume', async () => {
    const token = await createToken()
    await request(app).put('/api/v1/timer/start').set('Authorization', `Bearer ${token}`)
    await request(app).put('/api/v1/timer/stop').set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .put('/api/v1/timer/resume')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)

    const { body } = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const timer = body.timer
    expect(timer.status).toBe('RUNNING')
  })
  it.concurrent('PUT /finish', async () => {
    const token = await createToken()
    await request(app).put('/api/v1/timer/start').set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .put('/api/v1/timer/finish')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(204)

    const { body } = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const timer = body.timer
    expect(timer.status).toBe('READY')
    expect(timer.pomodoroCounter).toBe(1)
  })

  it.concurrent('PUT /change-stage/:timerId', async () => {
    const token = await createToken()
    const { body } = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .put(`/api/v1/timer/change-stage/${body.timer.id}`)
      .send({ stage: 'longBreak' })
    expect(res.status).toBe(204)

    const response = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const timer = response.body.timer
    expect(timer.status).toBe('READY')
    expect(timer.pomodoroCounter).toBe(0)
    expect(timer.currentStage).toBe('long_break')
  })
  describe.concurrent('Exceptions', async () => {
    it.concurrent('GET /timer - dont send token', async () => {
      const res = await request(app).get('/api/v1/timer')
      expect(res.status).toBe(401)
      expect(res.body).toEqual({
        error: true,
        message: 'Authorization header is required',
        name: 'Unauthorized'
      })
    })
  })
  it.concurrent('PUT /change-stage/:timerId - invalid stage', async () => {
    const token = await createToken()
    const { body } = await request(app).get('/api/v1/timer').set('Authorization', `Bearer ${token}`)
    const res = await request(app)
      .put(`/api/v1/timer/change-stage/${body.timer.id}`)
      .send({ stage: 'ñalskdjf' })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      error: true,
      message:
        "Stage 'ñalskdjf' is not valid. Permitted stages are: 'pomodoro', 'shortBreak', 'longBreak'.",
      name: 'InvalidStage'
    })
  })
})
