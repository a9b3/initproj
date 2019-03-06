import { gql } from 'apollo-server-koa'
import { default as Question } from 'mongodb/models/question'
import { default as Session } from 'mongodb/models/session'
import { default as User } from 'mongodb/models/user'
import { default as UserAnswer } from 'mongodb/models/user-answer'
import { Types } from 'mongoose'

export const typeDef = gql`
  type UserAnswer {
    answer: String!
    id: String!
    question: Question!
    user: User!
    session: Session!
  }

  input CreateUserAnswerInput {
    answer: String!
    questionId: String!
    sessionId: String!
  }

  input UserAnswerInput {
    question: String
    session: String
  }

  extend type Query {
    userAnswer(input: UserAnswerInput!): UserAnswer
  }

  extend type Mutation {
    createUserAnswer(input: CreateUserAnswerInput!): UserAnswer!
  }
`

export const resolver = {
  UserAnswer: {
    answer: ({ answer }: any) => answer,
    id: ({ id }: any) => id,
    question: ({ question }: any) => {
      return Question.findOne({ _id: new Types.ObjectId(question) })
    },
    user: ({ user }: any) => {
      return User.findOne({ _id: new Types.ObjectId(user) })
    },
    session: ({ session }: any) => {
      return Session.findOne({ _id: new Types.ObjectId(session) })
    },
  },
  Query: {
    userAnswer: async (
      root: any,
      { input: { question, session } }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new Error('Not Authorized')
      }

      const query: any = {
        user: new Types.ObjectId(context.user.id),
      }
      if (question) {
        query.question = new Types.ObjectId(question)
      }
      if (session) {
        query.session = new Types.ObjectId(session)
      }

      return UserAnswer.findOne(query)
    },
  },
  Mutation: {
    createUserAnswer: async (
      root: any,
      { input: { answer, questionId, sessionId } }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new Error('Not Authorized')
      }

      const [question, session] = await Promise.all([
        Question.findOne({
          _id: new Types.ObjectId(questionId),
        }).exec(),
        Session.findOne({
          _id: new Types.ObjectId(sessionId),
        }).exec(),
      ])

      if (!question) {
        throw new Error('No associated question found.')
      }
      if (!session) {
        throw new Error('No associated session found.')
      }

      const userAnswer = await new UserAnswer({
        answer,
        question: new Types.ObjectId(questionId),
        session: new Types.ObjectId(sessionId),
        user: new Types.ObjectId(context.user.id),
      }).save()
      return userAnswer
    },
  },
}
