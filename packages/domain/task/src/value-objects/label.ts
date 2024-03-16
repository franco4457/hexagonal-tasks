import { ArgumentNotProvided, ValueObject, isEmpty } from '@domain/core'

interface LabelProps {
  name: string
}

export class Label extends ValueObject<LabelProps> {
  get name(): string {
    return this.value.name
  }

  public validate(value: LabelProps): void {
    if (isEmpty(value.name)) {
      throw new ArgumentNotProvided('Label name cannot be empty')
    }
    if (isEmpty(value)) {
      throw new ArgumentNotProvided('Label cannot be empty')
    }
  }
}
