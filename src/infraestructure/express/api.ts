import type { MainRouter } from './routes/index'
import express from 'express'

export class ApiExpress {
  private readonly app: ReturnType<typeof express>
  constructor() {
    this.app = express()
  }

  getInstance(): ReturnType<typeof express> {
    return this.app
  }

  build(mainRouter: MainRouter): any {
    this.app.use((req, _res, next) => {
      console.log('Request received: ', '\x1b[36m', req.method, '\x1b[35m', req.path)
      next()
    })

    this.app.use(express.json())

    this.app.use('/api/v1', mainRouter.start())
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
