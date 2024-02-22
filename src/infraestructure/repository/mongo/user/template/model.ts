import mongoose from 'mongoose'
import { templateSchema } from './schema'

export const TEMPLATE_DI_REF = 'Template'
export const TemplateMongoModel = mongoose.model(TEMPLATE_DI_REF, templateSchema)
