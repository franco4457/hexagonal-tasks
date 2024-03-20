import { loggerRequest } from '@infrastructure/logger'
import { mainErrorHanlder } from './errors'
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
    this.app.disable('x-powered-by')
    this.app.use((req, res, next) => {
      const start = Date.now()
      res.on('finish', () => {
        loggerRequest({
          method: req.method,
          path: req.path,
          duration: Date.now() - start,
          status: res.statusCode
        })
      })
      next()
    })

    this.app.use(express.json())

    this.app.use('/api/v1', mainRouter.start())

    this.app.use(mainErrorHanlder)

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
