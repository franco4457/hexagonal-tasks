import { type EventBus } from '@domain/core'
import {
  type Timer,
  TimerRepository,
  type TimerModel,
  TimerAlreadyExists,
  TimerNotFound
} from '@domain/timer'
import { Logger } from '@infrastructure/logger'

export class InMemoryTimerRepository extends TimerRepository {
  private readonly timers: TimerModel[] = []
  constructor({ appContext, eventBus }: { appContext?: string; eventBus: EventBus }) {
    super({
      logger: new Logger({ appContext, context: InMemoryTimerRepository.name }),
      eventBus
    })
  }

  private exists({ value, key = 'id' }: { value: string; key?: keyof TimerModel }): number | false {
    const idx = this.timers.findIndex((timer) => timer[key] === value)
    return idx === -1 ? false : idx
  }

  private timerfinder({ value, key = 'id' }: { value: string; key?: keyof TimerModel }): {
    idx: number
    timer: TimerModel
  } {
    const idx = this.exists({ value, key })
    if (idx === false) {
      throw new TimerNotFound('Timer not found')
    }
    return {
      idx,
      timer: this.timers[idx]
    }
  }

  async getTimer(timerId: string): Promise<Timer> {
    const { timer } = this.timerfinder({ value: timerId })
    return this.mapper.toDomain(timer)
  }

  async getTimerByUserId(userId: string): Promise<Timer> {
    const { timer } = this.timerfinder({ value: userId, key: 'userId' })
    return this.mapper.toDomain(timer)
  }

  async create(props: Timer): Promise<Timer> {
    this.logger.debug(`creating entity to "timer" table: ${props.id}`)
    const { userId } = props.getProps()
    if (this.exists({ value: userId, key: 'userId' }) !== false) {
      throw new TimerAlreadyExists(userId, 'userId')
    }

    await this.save(props, async () => {
      this.timers.push(this.mapper.toPersistence(props))
    })
    return props
  }

  // FIXME: update only the fields that are changed
  async update(props: Timer): Promise<Timer> {
    this.logger.debug(`updating entity to "timer" table: ${props.id}`)
    const { idx } = this.timerfinder({ value: props.id })
    this.timers[idx] = this.mapper.toPersistence(props)
    return props
  }
}
