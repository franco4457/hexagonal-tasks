import { Entity, isEmpty } from '@/domain/core'
import { randomUUID } from 'crypto'

export interface LabelProps {
  name: string
}

export interface LabelModel extends LabelProps {
  id: string
  createdAt: Date
  updatedAt: Date
}

export class Label extends Entity<LabelProps> {
  public static create(props: LabelProps): Label {
    const id = randomUUID()
    const label = new Label({ id, props })
    return label
  }

  public validate(): void {
    if (isEmpty(this.props.name)) {
      throw new Error('Label name cannot be empty')
    }
  }
}
