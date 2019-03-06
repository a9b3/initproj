import { ApolloServer, gql } from 'apollo-server-koa'
import * as Koa from 'koa'
import { merge } from 'lodash'
import { path } from 'ramda'

import { decodeJwt, parseBearerJwt, verify } from 'auth/token'

import {
  resolver as enrollmentResolver,
  typeDef as enrollmentTypeDef,
} from './entities/enrollment'
import {
  resolver as enrollmentDateResolver,
  typeDef as enrollmentDateTypeDef,
} from './entities/enrollment-date'
import {
  resolver as questionResolver,
  typeDef as questionTypeDef,
} from './entities/question'
import {
  resolver as sessionResolver,
  typeDef as sessionTypeDef,
} from './entities/session'
import {
  resolver as userResolver,
  typeDef as userTypeDef,
} from './entities/user'
import {
  resolver as userAnswerResolver,
  typeDef as userAnswerTypeDef,
} from './entities/user-answer'

// https://blog.apollographql.com/modularizing-your-graphql-schema-code-d7f71d5ed5f2
const root = gql`
  type Query {
    root: String
  }

  type Mutation {
    root: String
  }
`

export default new ApolloServer({
  context: async ({ ctx }: { ctx: Koa.Context }) => {
    const bearer: any = path(['headers', 'authorization'], ctx.request)
    if (!bearer) {
      return { user: null }
    }
    const jwt = parseBearerJwt(bearer)
    return (await verify({ jwt })) ? { user: decodeJwt(jwt) } : { user: null }
  },
  resolvers: merge(
    userResolver,
    enrollmentDateResolver,
    enrollmentResolver,
    questionResolver,
    userAnswerResolver,
    sessionResolver,
  ),
  typeDefs: [
    root,
    userTypeDef,
    enrollmentDateTypeDef,
    enrollmentTypeDef,
    questionTypeDef,
    userAnswerTypeDef,
    sessionTypeDef,
  ],
})
