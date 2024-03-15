import { ArgumentNotProvided } from '../exeptions'
import { isEmpty } from '../guard'
import { type AggregateID } from '../id.schema'

export interface BaseEntityProps {
  id: AggregateID
  createdAt: Date
  updatedAt: Date
}

export interface CreateEntityProps<T> {
  id: AggregateID
  props: T
  createdAt?: Date
  updatedAt?: Date
}

export abstract class Entity<EntityProps> {
  private _id!: AggregateID
  private readonly _createdAt: Date
  private readonly _updatedAt: Date
  protected readonly props: EntityProps

  constructor({ id, createdAt, updatedAt, props }: CreateEntityProps<EntityProps>) {
    this.setID(id)
    this.validateProps(props)
    const now = new Date()
    this._createdAt = createdAt ?? now
    this._updatedAt = updatedAt ?? now
    this.props = props
    this.validate()
  }

  get id(): AggregateID {
    return this._id
  }

  private setID(id: AggregateID): void {
    this._id = id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  getProps(): EntityProps & BaseEntityProps {
    const propsCopy = {
      id: this._id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ...this.props
    }
    return Object.freeze(propsCopy)
  }

  public abstract validate(): void

  private validateProps(props: EntityProps): void {
    if (isEmpty(props)) {
      throw new ArgumentNotProvided('Entity props cannot be empty')
    }
  }
}
