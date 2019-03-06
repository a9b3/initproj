import {
  default as User,
  IUserDocument,
  validatePassword,
} from 'mongodb/models/user'

import { create } from './token'

/**
 * Check if user with email already exist before creating a user.
 */
export async function register({
  email,
  password,
  facebook,
}: {
  email: string
  password: string
  facebook?: { id: string }
}): Promise<IUserDocument> {
  const found = await User.findOne({ email })
  if (found) {
    throw new Error(`${email} already exists.`)
  }

  return User.createUser(new User({ email, password, facebook }))
}

/**
 * Verify email + password matches what is stored in database.
 */
export async function authenticate({
  email,
  password,
  ip,
  userAgent,
}: {
  email: string
  password: string
  ip?: string
  userAgent?: string
}) {
  const found = await User.findOne({ email })
  if (!found) {
    throw new Error(`${email} does not exist.`)
  }
  if (!validatePassword(password, found.password)) {
    throw new Error('Invalid password')
  }

  return create({ id: found.id, email, ip, userAgent })
}
