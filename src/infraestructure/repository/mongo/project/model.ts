import { model } from 'mongoose'
import { projectSchema } from './schema'

export const PROJECT_DI_REF = 'Project'
export const ProjectMongoModel = model(PROJECT_DI_REF, projectSchema)
