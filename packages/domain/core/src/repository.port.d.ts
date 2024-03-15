export interface RepositoryPort<Aggregate extends AggregateRoot<any>> {
  save: (entity: Aggregate, cb: () => Promise<void>) => Promise<void>
  transaction: <T>(handler: () => Promise<T>) => Promise<T>
}
