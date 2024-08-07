import { type Timer, TimerRepository, TimerNotFound } from '@domain/timer'
import { Logger } from '@infrastructure/logger'
import type { EventBus } from '@domain/core'
import { conn } from '../connect'
import type mongoose from 'mongoose'
import { TimerMongoModel } from './model'

export class MongoTimerRepository extends TimerRepository {
  private mongoose: typeof mongoose | null = null
  private readonly timers = TimerMongoModel
  constructor({ appContext, eventBus }: { appContext?: string; eventBus: EventBus }) {
    super({
      logger: new Logger({ appContext, context: MongoTimerRepository.name }),
      eventBus
    })
  }

  private async conn(): Promise<typeof mongoose> {
    if (this.mongoose != null) return this.mongoose
    this.mongoose = await conn()
    await this.timers.init()
    return this.mongoose
  }

  async getTimer(id: string): Promise<Timer> {
    try {
      await this.conn()
      const repoTimer = await this.timers.findOne({ id })
      if (repoTimer == null) throw new TimerNotFound(id)
      return this.mapper.toDomain(repoTimer)
    } catch (error) {
      this.logger.error('Error getting timer', error)
      throw error
    }
  }

  async getTimerByUserId(userId: string): Promise<Timer> {
    try {
      await this.conn()
      const repoTimer = await this.timers.findOne({ userId })
      if (repoTimer == null) throw new TimerNotFound(userId, 'userId')
      return this.mapper.toDomain(repoTimer)
    } catch (error) {
      this.logger.error('Error getting timer by userId', error)
      throw error
    }
  }

  async create(timer: Timer): Promise<Timer> {
    this.logger.debug(`creating entity to "timer" table: ${timer.id}`)
    try {
      await this.save(timer, async () => {
        await this.conn()
        await this.timers.create(this.mapper.toPersistence(timer))
      })
      return timer
    } catch (error) {
      console.log('MONGO_TIMER_CREATE', error)
      throw error
    }
  }

  async update(props: Timer): Promise<Timer> {
    this.logger.debug(`updating entity to "timer" table: ${props.id}`)
    await this.save(props, async () => {
      await this.conn()
      await this.timers.findOneAndUpdate({ id: props.id }, this.mapper.toPersistence(props))
    })
    return props
  }
}
