import { AuthenticationError, gql } from 'apollo-server-koa'
import { default as Question } from 'mongodb/models/question'
import { default as User } from 'mongodb/models/user'
import { default as UserAnswer } from 'mongodb/models/user-answer'
import { Types } from 'mongoose'

const QuestionTypes = [
  {
    key: 'mustBeTrue',
    display: 'must be true',
  },
  {
    key: 'mainPoint',
    display: 'main point',
  },
  {
    key: 'weaken',
    display: 'weaken',
  },
  {
    key: 'strengthen',
    display: 'strengthen',
  },
  {
    key: 'sufficientAssumption',
    display: 'sufficient assumption',
    optional: 'justify the conclusion',
  },
  {
    key: 'necessaryAssumption',
    display: 'necessary assumption',
  },
  {
    key: 'resolveTheParadox',
    display: 'resolve the paradox',
  },
  {
    key: 'methodOfReasoning',
    display: 'method of reasoning',
    optional: 'reasoning structure/identify the role',
  },
  {
    key: 'identifyTheFlaw',
    display: 'identify the flaw',
  },
  {
    key: 'parallelReasoning',
    display: 'parallel reasoning',
    optional: 'match the reasoning',
  },
  {
    key: 'analyzeTheReasoning',
    display: 'analyze the reasoning',
    optional: 'evaluate the argument',
  },
  {
    key: 'mustBeFalse',
    display: 'must be false',
    optional: 'cannot be true',
  },
  {
    key: 'identifyTheDisagreement',
    display: 'identify the disagreement',
    optional: 'point at issue',
  },
]

export const typeDef = gql`
  type Answer {
    key: String!
    display: String!
  }

  type QuestionOrigin {
    date: String
    num: Int
    section: Int
  }

  type QuestionType {
    key: String!
    display: String!
    optional: String
  }

  type Question {
    answers: [Answer!]!
    correctAnswer: String!
    explanation: String!
    origin: QuestionOrigin
    question: String!
    type: QuestionType!
    id: ID!
  }

  extend type Query {
    questions: [Question]
    question(id: String!): Question
    questionTypes: [QuestionType]
    nextQuestion(types: [String!]!, excludeIds: [String]): Question
  }
`

export const resolver = {
  Question: {
    id: ({ id }: any) => id,
    answers: ({ answers }: any) => {
      return Object.entries(answers).map(([key, value]) => ({
        key,
        display: value,
      }))
    },
    correctAnswer: ({ correctAnswer }: any) => correctAnswer,
    explanation: ({ explanation }: any) => explanation,
    origin: ({ origin }: any) => origin,
    question: ({ question }: any) => question,
    type: ({ type }: any) => QuestionTypes.find(({ key }) => key === type),
  },
  Query: {
    questions: async (root: any, p: any, context: any) => {
      // only admins should be able to query all questions
      return []
    },
    question: async (root: any, { id }: any, context: any) => {
      return Question.findOne({ _id: new Types.ObjectId(id) })
    },
    questionTypes: async () => {
      return QuestionTypes
    },
    nextQuestion: async (
      root: any,
      { types = [], excludeIds = [] }: any,
      context: any,
    ) => {
      if (!context.user) {
        throw new AuthenticationError('Not Authorized')
      }
      const user = await User.findOne({
        _id: new Types.ObjectId(context.user.id),
      })
      if (!user) {
        throw new AuthenticationError('Not Authorized')
      }

      const userAnswers = await UserAnswer.find({
        user: new Types.ObjectId(context.user.id),
      })

      return Question.findOne({
        _id: {
          $nin: userAnswers
            .map((userAnswer: any) => new Types.ObjectId(userAnswer.question))
            .concat(excludeIds.map((id: any) => new Types.ObjectId(id))),
        },
        type: {
          $in: types,
        },
      })
    },
  },
}
