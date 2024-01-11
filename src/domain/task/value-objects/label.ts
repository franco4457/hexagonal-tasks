import { ArgumentNotProvided, ValueObject, isEmpty } from '@/domain/core'
import { randomUUID } from 'crypto'

interface LabelProps {
  name: string
  id: string
}

type LabelPropsCreate = Omit<LabelProps, 'id'>

export class Label extends ValueObject<LabelProps> {
  static create = ({ name }: LabelPropsCreate): Label => {
    const id = randomUUID()
    return new Label({ id, name })
  }

  public validate(value: LabelProps): void {
    if (isEmpty(value.id)) {
      throw new ArgumentNotProvided('Label id cannot be empty')
    }
    if (isEmpty(value.name)) {
      throw new ArgumentNotProvided('Label name cannot be empty')
    }
    if (isEmpty(value)) {
      throw new ArgumentNotProvided('Label cannot be empty')
    }
  }
}
