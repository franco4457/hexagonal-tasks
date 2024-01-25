import { z } from 'zod'
import { type CreateProjectProps, type ProjectProps } from './project.entity'
import { customErrorMap } from '../core'
import { InvalidProject } from './project.exceptions'

export const projectSchema = z.object({
  id: z.string().uuid({ message: 'Invalid id' }),
  name: z
    .string({
      required_error: 'Name is required'
    })
    .min(3, { message: 'Name should be at least 3 characters' })
    .max(50, { message: 'Name should be less than 50 characters' }),
  userId: z.string({ required_error: 'userId is required' }).uuid({ message: 'Invalid userId' }),
  pomodoroCount: z.number().nonnegative()
})

export const validateProject = async (project: unknown): Promise<ProjectProps> => {
  try {
    const result = await projectSchema
      .omit({ id: true })
      .parseAsync(project, { errorMap: customErrorMap })
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidProject(error.issues)
    }
    throw new InvalidProject()
  }
}

export const validateCreateProject = async (project: unknown): Promise<CreateProjectProps> => {
  try {
    const result = await projectSchema
      .omit({ id: true, pomodoroCount: true })
      .parseAsync(project, { errorMap: customErrorMap })
    return result
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new InvalidProject(error.issues)
    }
    throw new InvalidProject()
  }
}
