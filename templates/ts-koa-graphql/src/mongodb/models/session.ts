// Session model each question should be associated with a valid session. Each
// session then can be used to persist session between user login session.

import { Document, model, Model, Schema, Types } from 'mongoose'

export interface ISessionDocument extends Document {
  user: Types.ObjectId
  active: boolean
  categories: string[]
  skipped: [string]
  answered: [string]
  current: string
}
export interface ISessionModel extends Model<ISessionDocument> {}

const SessionSchema = new Schema(
  {
    user: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    },
    active: {
      required: true,
      type: Boolean,
    },
    categories: {
      required: true,
      type: [String],
    },
    skipped: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    answered: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    current: {
      ref: 'Question',
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
)

export default model<ISessionDocument, ISessionModel>('Session', SessionSchema)
