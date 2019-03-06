import * as Koa from 'koa'
import * as mongoose from 'mongoose'

import * as redisClient from 'redis-client'

/**
 * This endpoint checks this service's dependencies for their status.
 */
export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  if (
    mongoose.connection.readyState !== 1 ||
    redisClient.getClient().connected !== true
  ) {
    ctx.status = 500
  }

  ctx.body = {
    mongo: mongoose.connection.readyState,
    redis: redisClient.getClient().connected,
  }
}
