import { EventHandler, type Repositories } from '@domain/core'
import { Timer, type TimerRepository } from '@domain/timer'
import { UserCreateEvent } from '@domain/user'

export class TimerCreateOnCreateUserEventHandler extends EventHandler {
  static EVENT_NAME = UserCreateEvent.name
  static repositoriesToInject = ['timerRepository' as Repositories]
  private readonly timerRepository: TimerRepository

  constructor(props: { timerRepository: TimerRepository }) {
    super()
    this.timerRepository = props.timerRepository
  }

  async handle(event: UserCreateEvent): Promise<void> {
    const timer = Timer.create({
      userId: event.aggregateId
    })
    await this.timerRepository.create(timer)
  }
}
