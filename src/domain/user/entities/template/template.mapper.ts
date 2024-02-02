import { type Mapper } from '@/domain/core'
import { Template, type TemplateModel } from './template.entity'
import { TemplateResponseDto } from './template.dto'
import { TaskTemplate } from '../../value-objects'

export class TemplateMapper implements Mapper<Template, TemplateModel, TemplateResponseDto> {
  toDomain(raw: TemplateModel): Template {
    return new Template({
      id: raw.id,
      props: { name: raw.name, tasks: raw.tasks.map((task) => new TaskTemplate({ ...task })) },
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
  }

  toPersistence(domain: Template): TemplateModel {
    const props = domain.getProps()
    return {
      id: props.id,
      name: props.name,
      tasks: props.tasks.map((task) => task.value),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt
    }
  }

  toResponse(domain: Template): TemplateResponseDto {
    const { id, createdAt, updatedAt, ...props } = domain.getProps()
    const response = new TemplateResponseDto({ id, createdAt, updatedAt })
    response.name = props.name
    response.tasks = props.tasks.map((task) => task.value)
    return response
  }
}
