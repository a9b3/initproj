import { gql } from 'apollo-server-koa'
import { default as EnrollmentDate } from 'mongodb/models/enrollment-date'
import { Types } from 'mongoose'

export const typeDef = gql`
  type EnrollmentDate {
    date: String!
    id: ID!
  }

  extend type Query {
    enrollmentDates: [EnrollmentDate]
    enrollmentDate(id: String!): EnrollmentDate
  }
`

export const resolver = {
  EnrollmentDate: {
    date: ({ date }: any) => date,
    id: ({ id }: any) => id,
  },
  Query: {
    enrollmentDates: async (root: any, p: any, context: any) => {
      return EnrollmentDate.find()
    },
    enrollmentDate: async (root: any, { id }: any, context: any) => {
      return EnrollmentDate.findOne({ _id: new Types.ObjectId(id) })
    },
  },
}
