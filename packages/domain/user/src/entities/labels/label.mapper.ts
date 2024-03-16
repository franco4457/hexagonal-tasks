import { type Mapper } from '@domain/core'
import { Label, type LabelModel } from './label.entity'
import { LabelResponseDto } from './label.dto'

export class LabelMapper implements Mapper<Label, LabelModel, LabelResponseDto> {
  toDomain(raw: LabelModel): Label {
    const label = new Label({
      id: raw.id,
      props: {
        name: raw.name
      },
      createdAt: new Date(raw.createdAt),
      updatedAt: new Date(raw.updatedAt)
    })

    return label
  }

  toPersistence(domain: Label): LabelModel {
    const props = domain.getProps()

    return {
      id: props.id,
      name: props.name,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    }
  }

  toResponse(domain: Label): LabelResponseDto {
    const { id, createdAt, updatedAt, ...props } = domain.getProps()
    const response = new LabelResponseDto({ id, createdAt, updatedAt })
    response.name = props.name
    return response
  }
}
