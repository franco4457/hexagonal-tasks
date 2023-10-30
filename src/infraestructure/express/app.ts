import express from 'express'
import { mainRouter } from './routes'
const app = express()

app.use((req, _res, next) => {
  console.log('Request received: ', '\x1b[36m', req.method, '\x1b[35m', req.path)
  next()
})

app.use(express.json())

app.use('/api/v1', mainRouter)

export default app
