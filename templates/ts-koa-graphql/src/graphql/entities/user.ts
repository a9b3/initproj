import { gql } from 'apollo-server-koa'
import { default as User } from 'mongodb/models/user'
import { Types } from 'mongoose'

export const typeDef = gql`
  type User {
    email: String!
    id: ID!
  }

  extend type Query {
    me(id: String!): User
  }
`

export const resolver = {
  User: {
    email: ({ email }: any) => email,
    id: ({ id }: any) => id,
  },
  Query: {
    me: async (root: any, { id }: any, context: any) => {
      const user = await User.findOne({ _id: new Types.ObjectId(id) })
      return user
    },
  },
}
