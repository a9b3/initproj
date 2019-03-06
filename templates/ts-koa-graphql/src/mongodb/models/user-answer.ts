// User Answers

import { Document, model, Model, Schema } from 'mongoose'

export interface IUserAnswerDocument extends Document {
  id: string
  answer: string
  question: string
  user: string
  session: string
}
export interface IUserAnswerModel extends Model<IUserAnswerDocument> {}

const UserAnswerSchema = new Schema(
  {
    answer: {
      required: true,
      type: String,
    },
    question: {
      ref: 'Question',
      required: true,
      type: Schema.Types.ObjectId,
    },
    user: {
      ref: 'User',
      required: true,
      type: Schema.Types.ObjectId,
    },
    session: {
      ref: 'Session',
      required: true,
      type: Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
)

export default model<IUserAnswerDocument, IUserAnswerModel>(
  'UserAnswer',
  UserAnswerSchema,
)
