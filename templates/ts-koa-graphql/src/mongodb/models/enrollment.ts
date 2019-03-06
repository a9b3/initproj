// The valid enrollments.

import { Document, model, Model, Schema, Types } from 'mongoose'

export interface IEnrollmentDocument extends Document {
  enrollmentDate: Types.ObjectId
  user: Types.ObjectId
}
export interface IEnrollmentModel extends Model<IEnrollmentDocument> {}

const EnrollmentSchema = new Schema(
  {
    enrollmentDate: {
      ref: 'EnrollmentDate',
      required: true,
      type: Types.ObjectId,
    },
    user: {
      ref: 'User',
      required: true,
      type: Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
)

export default model<IEnrollmentDocument, IEnrollmentModel>(
  'Enrollment',
  EnrollmentSchema,
)
