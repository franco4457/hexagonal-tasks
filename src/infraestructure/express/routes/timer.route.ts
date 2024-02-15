import { type TimerRepository } from '@/domain/timer'
import { Router } from 'express'
import { TimerController } from '../controllers/timer.controller'
import { userAuthMiddleware } from '../middleware'
export class TimerRouter {
  private readonly timerRouter = Router()
  private readonly timerController: TimerController
  constructor(timerRepository: TimerRepository) {
    this.timerController = new TimerController(timerRepository)
  }

  start(): Router {
    this.timerRouter.get(
      '/',
      userAuthMiddleware,
      this.timerController.getTimer.bind(this.timerController)
    )
    this.timerRouter.put(
      '/start',
      userAuthMiddleware,
      this.timerController.startTimer.bind(this.timerController)
    )
    this.timerRouter.put(
      '/stop',
      userAuthMiddleware,
      this.timerController.stopTimer.bind(this.timerController)
    )
    this.timerRouter.put(
      '/resume',
      userAuthMiddleware,
      this.timerController.resumeTimer.bind(this.timerController)
    )
    this.timerRouter.put(
      '/finish',
      userAuthMiddleware,
      this.timerController.finishTimer.bind(this.timerController)
    )
    this.timerRouter.put(
      '/change-stage/:timerId',
      this.timerController.changeStage.bind(this.timerController)
    )
    return this.timerRouter
  }
}
