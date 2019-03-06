// The valid enrollment dates for people to sign up for.

import { Document, model, Model, Schema } from 'mongoose'

export interface IEnrollmentDateDocument extends Document {
  date: Date
}
export interface IEnrollmentDateModel extends Model<IEnrollmentDateDocument> {}

const EnrollmentDateSchema = new Schema(
  {
    date: {
      default: null,
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

export default model<IEnrollmentDateDocument, IEnrollmentDateModel>(
  'EnrollmentDate',
  EnrollmentDateSchema,
)
