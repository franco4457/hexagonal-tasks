import { z } from 'zod'
import type { TaskPropsCreate } from './task.entity'
import { ValidationError, customErrorMap } from '../core'

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
    .max(50, { message: 'Description should be less than 50 characters' }),
  userId: z.string().uuid({ message: 'Invalid userId' }),
  order: z
    .number({
      required_error: 'Order is required'
    })
    .int()
    .nonnegative({ message: 'Order should be equals or greater than 0' }),
  project: z
    .object({
      id: z.string().uuid({ message: 'Invalid project id' }).optional(),
      name: z.string()
    })
    .optional(),
  labels: z
    .object(
      {
        id: z.string().uuid({ message: 'Invalid label id' }).optional(),
        name: z.string()
      },
      { required_error: 'Labels is required' }
    )
    .array(),
  isCompleted: z.boolean()
})

type ValidatedProps = Omit<TaskPropsCreate, 'userId' | 'pomodoro'> & {
  project?: { name: string; id?: string } | null
  labels: Array<{ name: string; id?: string }>
}

export const validateTask = async (task: unknown): Promise<ValidatedProps> => {
  try {
    const result = await TaskSchema.omit({ id: true, userId: true, isCompleted: true }).parseAsync(
      task,
      { errorMap: customErrorMap }
    )
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalida Task', error.issues)
    }
    throw new ValidationError('Invalida Task')
  }
}
