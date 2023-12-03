import { z } from 'zod'
import type { ITaskInput } from './task.entity'
import { ValidationError } from '../core'

export const TaskSchema = z.object({
  id: z.string().uuid({ message: 'Invalid id' }),
  title: z
    .string({
      required_error: 'Title is required'
    })
    .min(3, { message: 'Title should be at least 3 characters' })
    .max(50, { message: 'Title should be less than 50 characters' }),
  description: z
    .string({
      required_error: 'Description is required'
    })
    .min(3, { message: 'Description should be at least 3 characters' })
    .max(50, { message: 'Description should be less than 50 characters' })
})

export const validateTask = async (task: unknown): Promise<ITaskInput> => {
  try {
    const result = await TaskSchema.omit({ id: true }).parseAsync(task)
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalida Task', error.issues)
    }
    throw new ValidationError('Invalida Task')
  }
}
