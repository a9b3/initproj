import { ApolloError, AuthenticationError, gql } from 'apollo-server-koa'
import { default as Question } from 'mongodb/models/question'
import { default as Session } from 'mongodb/models/session'
import { default as User } from 'mongodb/models/user'
import { Types } from 'mongoose'

export const typeDef = gql`
  type Session {
    active: Boolean!
    answered: [Question]!
    categories: [String!]!
    current: Question
    id: String!
    skipped: [Question]!
    user: User!
  }

  input CreateSessionInput {
    userId: String!
    categories: [String!]!
  }

  input SessionEndInput {
    sessionId: String!
    userId: String!
  }

  input SessionSkipInput {
    sessionId: String!
    userId: String!
  }

  input SessionNextInput {
    sessionId: String!
    userId: String!
  }

  extend type Query {
    currentSession(userId: String!): Session
  }

  extend type Mutation {
    createSession(input: CreateSessionInput!): Session!
    sessionEnd(input: SessionEndInput!): Session!
    sessionSkip(input: SessionSkipInput!): Session!
    sessionNext(input: SessionNextInput!): Session!
  }
`

export const resolver = {
  Session: {
    id: ({ id }: any) => id,
    active: ({ active }: any) => active,
    categories: ({ categories }: any) => categories,
    current: ({ current }: any) => {
      return Question.findOne({
        _id: new Types.ObjectId(current),
      })
    },
    skipped: ({ skipped }: any) => {
      return Question.find({
        _id: { $in: skipped.map((id: string) => new Types.ObjectId(id)) },
      })
    },
    answered: ({ answered }: any) => {
      return Question.find({
        _id: { $in: answered.map((id: string) => new Types.ObjectId(id)) },
      })
    },
    user: ({ user }: any) => {
      return User.findOne({ _id: new Types.ObjectId(user) })
    },
  },
  Query: {
    currentSession: async (root: any, { userId }: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError('Not Authorized')
      }
      return Session.findOne({
        active: true,
        user: new Types.ObjectId(userId),
      })
    },
  },
  Mutation: {
    createSession: async (
      root: any,
      { input: { userId, categories } }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not Authorized')
      }

      const activeSession = await Session.findOne({
        active: true,
        user: new Types.ObjectId(userId),
      })
      if (activeSession) {
        throw new ApolloError('Cannot have more than one active session.')
      }

      const nextQuestion = await Question.findOne({
        type: {
          $in: categories,
        },
      })

      return new Session({
        active: true,
        user: new Types.ObjectId(userId),
        categories,
        current: nextQuestion ? new Types.ObjectId(nextQuestion.id) : undefined,
      }).save()
    },
    sessionEnd: async (
      root: any,
      { input: { userId, sessionId } }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not Authorized')
      }

      const updatedSession = await Session.findOneAndUpdate(
        {
          _id: new Types.ObjectId(sessionId),
          user: new Types.ObjectId(userId),
          active: true,
        },
        {
          active: false,
        },
        {
          new: true,
        },
      )
      if (!updatedSession) {
        throw new ApolloError('No currently active session.')
      }

      return updatedSession
    },
    sessionSkip: async (
      root: any,
      { input: { sessionId, userId } }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not Authorized')
      }

      const session = await Session.findOne({
        _id: new Types.ObjectId(sessionId),
        user: new Types.ObjectId(userId),
        active: true,
      })

      if (session && session.current) {
        const nextQuestion = await Question.findOne({
          _id: {
            $nin: session.skipped
              .concat(session.answered)
              .concat([session.current])
              .map((id: any) => new Types.ObjectId(id)),
          },
          type: {
            $in: session.categories,
          },
        })

        const updatedSession = await Session.findOneAndUpdate(
          {
            _id: new Types.ObjectId(sessionId),
            user: new Types.ObjectId(userId),
            active: true,
          },
          {
            $push: {
              skipped: session.current,
            },
            current: nextQuestion
              ? new Types.ObjectId(nextQuestion.id)
              : undefined,
          },
          {
            new: true,
          },
        )
        if (!updatedSession) {
          throw new ApolloError('No currently active session.')
        }

        return updatedSession
      } else {
        return session
      }
    },
    sessionNext: async (
      root: any,
      { input: { sessionId, userId } }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not Authorized')
      }

      const session = await Session.findOne({
        _id: new Types.ObjectId(sessionId),
        user: new Types.ObjectId(userId),
        active: true,
      })

      if (session && session.current) {
        const nextQuestion = await Question.findOne({
          _id: {
            $nin: session.skipped
              .concat(session.answered)
              .concat([session.current])
              .map((id: any) => new Types.ObjectId(id)),
          },
          type: {
            $in: session.categories,
          },
        })

        const updatedSession = await Session.findOneAndUpdate(
          {
            _id: new Types.ObjectId(sessionId),
            user: new Types.ObjectId(userId),
            active: true,
          },
          {
            $push: {
              answered: session.current,
            },
            current: nextQuestion
              ? new Types.ObjectId(nextQuestion.id)
              : undefined,
          },
          {
            new: true,
          },
        )
        if (!updatedSession) {
          throw new ApolloError('No currently active session.')
        }

        return updatedSession
      } else {
        return session
      }
    },
  },
}
