import mongoose from 'mongoose'
import { labelSchema } from './schema'

export const LABEL_DI_REF = 'Label'
export const LabelMongoModel = mongoose.model(LABEL_DI_REF, labelSchema)
