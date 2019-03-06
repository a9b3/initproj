import { AuthenticationError, gql } from 'apollo-server-koa'
import { default as Enrollment } from 'mongodb/models/enrollment'
import { default as EnrollmentDate } from 'mongodb/models/enrollment-date'
import { default as User } from 'mongodb/models/user'
import { Types } from 'mongoose'

export const typeDef = gql`
  type Enrollment {
    enrollmentDate: EnrollmentDate!
    user: User!
    id: ID!
  }

  extend type Query {
    enrollments: [Enrollment]
    enrollment(id: String!): Enrollment
  }
`

export const resolver = {
  Enrollment: {
    enrollmentDate: ({ enrollmentDate }: any) => {
      return EnrollmentDate.findOne({ _id: new Types.ObjectId(enrollmentDate) })
    },
    id: ({ id }: any) => id,
    user: ({ user }: any) => {
      return User.findOne({ _id: new Types.ObjectId(user) })
    },
  },
  Query: {
    enrollments: async (root: any, p: any, { user }: any) => {
      if (!user) {
        throw new AuthenticationError('Not Authorized')
      }

      return Enrollment.find({ user: new Types.ObjectId(user.id) })
    },
    enrollment: async (root: any, { id }: any, context: any) => {
      return Enrollment.findOne({ _id: new Types.ObjectId(id) })
    },
  },
}
