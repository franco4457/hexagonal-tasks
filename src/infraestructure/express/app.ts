import express from 'express'
import { mainRouter } from './routes'
const app = express()

app.use((req, _res, next) => {
  console.log('Request received: ', '\x1b[36m', req.method, '\x1b[35m', req.path)
  next()
})

app.use(express.json())

app.use('/api/v1', mainRouter)
export class ApiExpress {
  constructor(private readonly app: ReturnType<typeof express>) {}
  getInstance(): ReturnType<typeof express> {
    return this.app
  }

  start(port: number | string, host: string): void {
    this.app.listen(port, () => {
      console.log('--------------------')
      console.log(`[EXPRESS] Server listen on ${host}`)
      console.log('--------------------')
    })
  }
}
export default new ApiExpress(app)
