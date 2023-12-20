import { type Entity } from './ddd'

export interface Mapper<DomainEntity extends Entity<any>, DbRecord, Response = any> {
  toDomain: (raw: any) => DomainEntity
  toPersistence: (domain: DomainEntity) => DbRecord
  toResponse: (domain: DomainEntity) => Response
}
