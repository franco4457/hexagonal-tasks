import { type ZodIssue } from 'zod'
import { NotFound, ValidationError } from '../core'
import { type Project } from './project.entity'

export class InvalidProject extends ValidationError {
  constructor(issues?: ZodIssue[]) {
    super('Invalid project', issues)
  }
}

export class ProjectNotFound extends NotFound {
  constructor(value: string, field: keyof Project | keyof Project['props'] = 'id') {
    super(`Project with ${field}: ${value} not found`)
  }
}
