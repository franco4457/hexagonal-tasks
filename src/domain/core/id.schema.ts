import { z } from 'zod'
import { customErrorMap } from './custom-error'
import { ValidationError } from './exeptions'

export type AggregateID = `${string}-${string}-${string}-${string}-${string}` | string

export const valdiateID = async (id: unknown, key: string = 'ID'): Promise<AggregateID> => {
  const UUIDSchema = z.string().uuid({
    message: `${key} should be a valid UUID(something like this: 'string-string-string-string-string')`
  })
  try {
    const result = await UUIDSchema.parseAsync(id, {
      errorMap: customErrorMap
    })
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError(`Invalid ${key}`, error.issues)
    }
    throw new ValidationError(`Invalid ${key}`)
  }
}
