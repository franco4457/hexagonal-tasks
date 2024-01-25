import { RepositoryBase, type AggregateID, type LoggerPort } from '@/domain/core'
import { type TimerModel, type Timer } from './timer.entity'
import { TimerMapper } from './timer.mapper'
import type EventEmitter2 from 'eventemitter2'

export interface ITimerRepository {
  create: (props: Timer) => Promise<Timer>
  getTimer: (id: Timer['id']) => Promise<Timer>
  getTimerByUserId: (userId: AggregateID) => Promise<Timer>
  update: (props: Timer) => Promise<Timer>
}

export abstract class TimerRepository
  extends RepositoryBase<Timer, TimerModel>
  implements ITimerRepository
{
  readonly repositoryName = 'TimerRepository'
  constructor(props: { logger: LoggerPort; eventEmitter: EventEmitter2 }) {
    super({ ...props, mapper: new TimerMapper() })
  }
  abstract create(props: Timer): Promise<Timer>
  abstract getTimer(id: Timer['id']): Promise<Timer>
  abstract getTimerByUserId(userId: AggregateID): Promise<Timer>
  abstract update(props: Timer): Promise<Timer>
}
