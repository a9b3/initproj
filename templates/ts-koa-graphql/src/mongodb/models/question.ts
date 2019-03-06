// Questions

import { Document, model, Model, Schema } from 'mongoose'

export interface IQuestionDocument extends Document {
  answers: {}
  correctAnswer: string
  explanation: string
  origin: {
    date: Date
    num: number
    section: number
  }
  question: string
  type: string
}
export interface IQuestionModel extends Model<IQuestionDocument> {}

const QuestionSchema = new Schema(
  {
    // { a: string, b: string, c: string }
    answers: {
      required: true,
      type: Schema.Types.Mixed,
    },
    // 'a'
    correctAnswer: {
      required: true,
      type: String,
    },
    explanation: {
      required: true,
      type: String,
    },
    // Where the question is from.
    origin: {
      date: {
        type: Date,
      },
      num: {
        type: Number,
      },
      section: {
        type: Number,
      },
    },
    question: {
      required: true,
      type: String,
    },
    type: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export default model<IQuestionDocument, IQuestionModel>(
  'Question',
  QuestionSchema,
)
