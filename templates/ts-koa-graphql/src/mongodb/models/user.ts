// User

import * as bcrypt from 'bcryptjs'
import { Document, model, Model, Schema } from 'mongoose'

function encryptPassword(password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

export function validatePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export interface IUserDocument extends Document {
  email: string
  facebook?: {}
  id: string
  password: string
}
interface IUserModel extends Model<IUserDocument> {
  _id: string
  createUser(user: IUserDocument): Promise<IUserDocument>
}

const UserSchema = new Schema(
  {
    email: {
      required: true,
      type: String,
    },
    // meta data from facebook
    // {id}
    facebook: {},
    password: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.static('createUser', function(
  user: IUserDocument,
): Promise<IUserDocument> {
  user.password = encryptPassword(user.password)
  return user.save()
})

export default model<IUserDocument, IUserModel>('User', UserSchema)
