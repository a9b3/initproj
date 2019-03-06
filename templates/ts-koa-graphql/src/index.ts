import * as cors from '@koa/cors'
import * as Koa from 'koa'
import * as bodyParser from 'koa-bodyparser'
import * as mongoose from 'mongoose'

import config from 'config'
import { default as graphqlServer } from 'graphql/server'
import { default as errorHandler } from 'koa/middleware/error-handler'
import { default as router } from 'koa/router'
import { default as logger } from 'logger'
import * as redis from 'redis-client'

/**
 * App initialization logic
 */
async function main() {
  const app = new Koa()

  app.use(errorHandler)
  app.use(bodyParser())
  app.use(cors())
  app.use(router.routes())
  app.use(router.allowedMethods())
  app.on('error', err => {
    logger.log('error', err)
  })

  logger.log(
    'info',
    `connecting to mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${
      config.MONGO_DB_NAME
    }`,
  )
  await mongoose.connect(
    `mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${
      config.MONGO_DB_NAME
    }`,
    {
      auth: config.MONGO_USER &&
        config.MONGO_PASS && {
          password: config.MONGO_PASS,
          user: config.MONGO_USER,
        },
      useNewUrlParser: true,
    },
  )
  logger.log('info', 'connected to mongo')

  logger.log(
    'info',
    `connecting to redis with following configs {
    host: ${config.REDIS_HOST},
    pass: ${config.REDIS_PASS},
    port: ${config.REDIS_PORT},
  }`,
  )
  await redis.init({
    host: config.REDIS_HOST,
    pass: config.REDIS_PASS,
    port: config.REDIS_PORT,
  })
  logger.log('info', 'connected to redis')

  graphqlServer.applyMiddleware({ app })

  app.listen({ port: config.PORT }, () => {
    logger.log('info', `http listening on port ${config.PORT}`)
  })
}

main().catch(err => {
  logger.log('error', err)
})
