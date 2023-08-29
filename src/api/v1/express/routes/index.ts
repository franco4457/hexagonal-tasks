import e from 'express'
import { userRouter } from './user.route'
import { healthRouter } from './health.route'

export const mainRouter = e.Router()

mainRouter.use('/health', healthRouter)
mainRouter.use('/user', userRouter)
