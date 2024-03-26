import type { AggregateRoot, EventBus } from '../ddd'
import type { LoggerPort } from '../logger.port'
import type { RepositoryPort } from '../repository.port'
import type { Mapper } from '../mapper'

export interface RepositoryQueryConfig {
  raw?: boolean
}
export abstract class RepositoryBase<
  Aggregate extends AggregateRoot<any>,
  DbModel extends Record<string, unknown>
> implements RepositoryPort<Aggregate>
{
  protected abstract readonly repositoryName: string
  protected readonly logger: LoggerPort
  protected readonly mapper: Mapper<Aggregate, DbModel>
  private readonly eventBus: EventBus
  constructor(props: {
    logger: LoggerPort
    eventBus: EventBus
    mapper: Mapper<Aggregate, DbModel>
  }) {
    this.logger = props.logger
    this.mapper = props.mapper
    this.eventBus = props.eventBus
  }

  async save(entity: Aggregate, cb: () => Promise<void>): Promise<void> {
    await entity.publishEvents(this.eventBus, this.logger)
    await cb()
  }

  async transaction<T>(handler: () => Promise<T>): Promise<T> {
    this.logger.log('Transaction started')
    try {
      const result = await handler()
      this.logger.log('Transaction commited')
      return result
    } catch (error) {
      this.logger.error('Transaction aborted')
      throw error
    }
  }
}
