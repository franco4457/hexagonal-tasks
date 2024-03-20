import {
  TimerByUserIdQuery,
  TimerByUserIdQueryHandler,
  TimerChangeStageCommand,
  TimerChangeStageService,
  TimerFinishCommand,
  TimerFinishService,
  TimerResumeCommand,
  TimerResumeService,
  TimerStartCommand,
  TimerStartService,
  TimerStopCommand,
  TimerStopService
} from '@application/timer'
import { TimerMapper, type TimerRepository } from '@domain/timer'
import { type NextFunction, type Request, type Response } from 'express'

// XXX: check if it's better to use a extra property like 'timerId' on userAuth.decodedToken
// this implies changes all sercices and commands but don't need to pass the userId as parameter
export class TimerController {
  private readonly mapper = new TimerMapper()
  /* ---- COMMAND HANDLER ---- */
  private readonly timerStartService: TimerStartService
  private readonly timerStopService: TimerStopService
  private readonly timerResumeService: TimerResumeService
  private readonly timerFinishService: TimerFinishService
  private readonly timerChangeStageService: TimerChangeStageService
  /* ---- QUERY HANDLER ---- */
  private readonly timerByUserIdQuery: TimerByUserIdQueryHandler

  constructor(private readonly timerRepository: TimerRepository) {
    this.timerStartService = new TimerStartService(this.timerRepository)
    this.timerStopService = new TimerStopService(this.timerRepository)
    this.timerResumeService = new TimerResumeService(this.timerRepository)
    this.timerFinishService = new TimerFinishService(this.timerRepository)

    this.timerChangeStageService = new TimerChangeStageService(this.timerRepository)

    this.timerByUserIdQuery = new TimerByUserIdQueryHandler(this.timerRepository)
  }

  async getTimer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      const timer = await this.timerByUserIdQuery.execute(new TimerByUserIdQuery({ userId }))
      res.status(200).json({ timer: this.mapper.toResponse(timer) })
    } catch (e) {
      next(e)
    }
  }

  async startTimer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      await this.timerStartService.execute(new TimerStartCommand({ userId }))
      res.status(204).end()
    } catch (e) {
      next(e)
    }
  }

  async stopTimer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      await this.timerStopService.execute(new TimerStopCommand({ userId }))
      res.status(204).end()
    } catch (e) {
      next(e)
    }
  }

  async resumeTimer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      await this.timerResumeService.execute(new TimerResumeCommand({ userId }))
      res.status(204).end()
    } catch (e) {
      next(e)
    }
  }

  async finishTimer(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { id: userId } = req.userAuth.decodedToken
    try {
      await this.timerFinishService.execute(new TimerFinishCommand({ userId }))
      res.status(204).end()
    } catch (e) {
      next(e)
    }
  }

  async changeStage(req: Request, res: Response, next: NextFunction): Promise<void> {
    // FIXME: check if it's better to use a extra property like 'timerId' on userAuth.decodedToken
    // or use userId as parameter
    const { timerId } = req.params
    const { stage } = req.body
    try {
      await this.timerChangeStageService.execute(new TimerChangeStageCommand({ timerId, stage }))
      res.status(204).end()
    } catch (e) {
      next(e)
    }
  }
}
