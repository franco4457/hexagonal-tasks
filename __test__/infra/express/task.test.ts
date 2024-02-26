import request from 'supertest'
import api from '@/infraestructure/express/app'
import { MOCK_TOKEN, TEST_ID } from '../../utils'

const testTask = {
  title: 'title',
  description: 'description',
  order: 1,
  pomodoro: {
    estimated: 1
  },
  labels: [],
  userId: TEST_ID
}

// TODO: Check all test don't depend on each other
describe.sequential('Task', async () => {
  const app = (await api).getInstance()
  it('POST /task', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send(testTask)
      .set('Authorization', MOCK_TOKEN)
    expect(res.status).toBe(201)
    const { task } = res.body
    expect(task).toHaveProperty('id')
    expect(task.title).toBe(testTask.title)
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([])
    expect(task.project).toBe(null)
  })
  it('POST /task - whit project and labels', async () => {
    const res = await request(app)
      .post('/api/v1/task')
      .send({
        ...testTask,
        labels: [{ name: 'label' }, { name: 'label2' }],
        project: { name: 'project' }
      })
      .set('Authorization', MOCK_TOKEN)
    expect(res.status).toBe(201)
    const { task } = res.body
    expect(task).toHaveProperty('id')
    expect(task.title).toBe(testTask.title)
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([{ name: 'label' }, { name: 'label2' }])
    expect(task.project).toEqual({ name: 'project' })
  })
  it('GET /task/all', async () => {
    const res = await request(app).get('/api/v1/task/all')
    expect(res.status).toBe(200)
    const { tasks } = res.body
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    expect(task).toHaveProperty('id')
    expect(task.title).toBe(testTask.title)
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([])
    expect(task.project).toBe(null)

    // second task
    expect(task2).toHaveProperty('id')
    expect(task2.title).toBe(testTask.title)
    expect(task2.isCompleted).toBe(false)
    expect(task2.description).toBe('description')
    expect(task2.userId).toBe(TEST_ID)
    expect(task2.labels).toEqual([{ name: 'label' }, { name: 'label2' }])
    expect(task2.project).toEqual({ name: 'project' })
  })

  it('POST /task/bulk', async () => {
    const res = await request(app)
      .post('/api/v1/task/bulk')
      .send({
        data: [
          {
            task: {
              ...testTask,
              title: 'title1'
            }
          },
          {
            task: {
              ...testTask,
              title: 'title2',
              project: { name: 'project' },
              labels: [{ name: 'label' }, { id: TEST_ID, name: 'label2' }]
            }
          }
        ]
      })
      .set('Authorization', MOCK_TOKEN)

    expect(res.status).toBe(201)
    const { tasks } = res.body
    expect(tasks).toHaveLength(2)
    const [task, task2] = tasks
    expect(task).toHaveProperty('id')
    expect(task.title).toBe('title1')
    expect(task.isCompleted).toBe(false)
    expect(task.description).toBe('description')
    expect(task.userId).toBe(TEST_ID)
    expect(task.labels).toEqual([])
    expect(task.project).toBe(null)

    // second task
    expect(task2).toHaveProperty('id')
    expect(task2.title).toBe('title2')
    expect(task2.isCompleted).toBe(false)
    expect(task2.description).toBe('description')
    expect(task2.userId).toBe(TEST_ID)
    expect(task2.labels).toEqual([{ name: 'label' }, { name: 'label2' }])
    expect(task2.project).toEqual({ name: 'project' })
  })
  describe('Exceptions', async () => {
    it('POST /task - error missig fields', async () => {
      const res = await request(app).post('/api/v1/task').send({}).set('Authorization', MOCK_TOKEN)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid Task',
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
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'undefined',
            path: ['order'],
            message: 'Order is required'
          },
          {
            code: 'invalid_type',
            expected: 'object',
            received: 'undefined',
            path: ['pomodoro'],
            message: 'Pomodoro is required'
          },
          {
            code: 'invalid_type',
            expected: 'array',
            received: 'undefined',
            path: ['labels'],
            message: 'Labels is required'
          }
        ],
        errors: [
          'Title is required',
          'Description is required',
          'Order is required',
          'Pomodoro is required',
          'Labels is required'
        ],
        message: 'Invalid Task'
      })
    })
    it('POST /task - error invalid types', async () => {
      const res = await request(app)
        .post('/api/v1/task')
        .send({
          title: { title: 'title' },
          description: 20,
          order: 'one',
          pomodoro: [],
          labels: {},
          project: { name: {} }
        })
        .set('Authorization', MOCK_TOKEN)
      expect(res.status).toBe(422)
      expect(res.body).toEqual({
        error: true,
        name: 'Invalid Task',
        issues: [
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'object',
            path: ['title'],
            message: "Invalid type on 'title'. expected string, received object"
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'number',
            path: ['description'],
            message: "Invalid type on 'description'. expected string, received number"
          },
          {
            code: 'invalid_type',
            expected: 'number',
            received: 'string',
            path: ['order'],
            message: "Invalid type on 'order'. expected number, received string"
          },
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'object',
            path: ['project', 'name'],
            message: "Invalid type on 'project.name'. expected string, received object"
          },
          {
            code: 'invalid_type',
            expected: 'object',
            message: "Invalid type on 'pomodoro'. expected object, received array",
            path: ['pomodoro'],
            received: 'array'
          },

          {
            code: 'invalid_type',
            expected: 'array',
            received: 'object',
            path: ['labels'],
            message: "Invalid type on 'labels'. expected array, received object"
          }
        ],
        errors: [
          "Invalid type on 'title'. expected string, received object",
          "Invalid type on 'description'. expected string, received number",
          "Invalid type on 'order'. expected number, received string",
          "Invalid type on 'project.name'. expected string, received object",
          "Invalid type on 'pomodoro'. expected object, received array",
          "Invalid type on 'labels'. expected array, received object"
        ],
        message: 'Invalid Task'
      })
    })
    it('POST /task/', async () => {
      const res = await request(app).get('/api/v1/task')
      expect(res.status).toBe(401)
      expect(res.body).toEqual({
        error: true,
        message: 'Authorization header is required',
        name: 'Unauthorized'
      })
    })
  })
})
