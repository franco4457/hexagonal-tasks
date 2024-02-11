// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class QueryBase {}

export interface IQueryHandler<TQuery extends QueryBase, TResult = any> {
  execute: (query: TQuery) => Promise<TResult>
}
