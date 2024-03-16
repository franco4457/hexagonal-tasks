import { z } from 'zod'
import { InvalidLabel } from './label.exceptions'
import { customErrorMap } from '@domain/core'

export const labelSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid user id' }),
  id: z.string().uuid({ message: 'Invalid id' }),
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(0, { message: 'Name should be at least 3 characters' })
    .max(50, { message: 'Name should be less than 50 characters' })
})

export const validateLabel = async (label: unknown): Promise<{ name: string }> => {
  try {
    return await labelSchema.pick({ name: true }).parseAsync(label, {
      errorMap: customErrorMap
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidLabel(error.issues)
    }
    throw new InvalidLabel()
  }
}
