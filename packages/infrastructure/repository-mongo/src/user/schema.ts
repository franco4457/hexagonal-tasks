import type { UserModel } from '@domain/user'
import { Schema } from 'mongoose'
import { TEMPLATE_DI_REF } from './template/model'
import { LABEL_DI_REF } from './label/model'

export const userSchema = new Schema<UserModel>(
  {
    id: {
      type: 'string',
      required: true,
      unique: true,
      index: true
    },
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    lastname: 'string',
    username: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string'
    },
    labels: [
      {
        type: Schema.Types.ObjectId,
        ref: LABEL_DI_REF,
        default: []
      }
    ],
    templates: [
      {
        type: Schema.Types.ObjectId,
        ref: TEMPLATE_DI_REF,
        default: []
      }
    ]
  },
  {
    timestamps: true
  }
)
