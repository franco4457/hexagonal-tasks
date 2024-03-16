import { customErrorMap } from '@domain/core'
import { z } from 'zod'
import { InvalidTemplate } from './template.exceptions'

const templateSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(0)
    .max(255),
  tasks: z.array(
    z.object({
      name: z
        .string({
          required_error: 'Name is required'
        })
        .min(0)
        .max(255),
      description: z
        .string({
          required_error: 'Description is required'
        })
        .min(0)
        .max(255),
      order: z
        .number({
          required_error: 'Order is required'
        })
        .int()
        .positive(),
      pomodoroEstimated: z
        .number({
          required_error: 'Pomodoro estimated is required'
        })
        .int()
        .positive(),
      projectId: z
        .string({
          required_error: 'Project id is required'
        })
        .uuid()
        .nullable()
    }),
    {
      required_error: 'Tasks are required'
    }
  )
})

export const validateTemplate = async (
  template: unknown
): Promise<{
  name: string
  tasks: Array<{
    name: string
    description: string
    order: number
    pomodoroEstimated: number
    projectId: string | null
  }>
}> => {
  try {
    return await templateSchema.pick({ name: true, tasks: true }).parseAsync(template, {
      errorMap: customErrorMap
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidTemplate(error.errors)
    }
    throw error
  }
}
