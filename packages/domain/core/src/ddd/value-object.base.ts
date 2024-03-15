import { ArgumentNotProvided } from '../exeptions'
import { isEmpty } from '../guard'

export abstract class ValueObject<T> {
  protected readonly _value: T

  constructor(value: T) {
    this.checkIfEmpty(value)
    this.validate(value)
    this._value = value
  }

  public get value(): T {
    return this._value
  }

  protected abstract validate(value: T): void

  static isValueObject(value: unknown): value is ValueObject<unknown> {
    return value instanceof ValueObject
  }

  equals(valueObject?: ValueObject<T>): boolean {
    if (valueObject == null) {
      return false
    }
    return JSON.stringify(this) === JSON.stringify(valueObject)
  }

  private checkIfEmpty(value: T): void {
    if (isEmpty(value)) {
      throw new ArgumentNotProvided('ValueObject cannot be empty')
    }
  }
}
