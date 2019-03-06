/*
 * Wrap redis client to return promises.
 * All functions are appended with Async
 *
 * ex.
 *
 * redis.get()
 *
 *  becomes
 *
 * redis.getAsync()
 */
import * as bluebird from 'bluebird'
import * as redis from 'redis'

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

// Reference to redis client.
let client: any

export function init({
  host,
  port,
  pass,
}: {
  host: string
  port: number
  pass?: string
}) {
  return new Promise((resolve, reject) => {
    if (client) {
      resolve()
    }

    client = redis.createClient({
      host,
      password: pass,
      port,
    })

    client.once('ready', resolve)
    client.once('error', (err: Error) => {
      reject(err)
    })
  })
}

export function getClient() {
  return client
}
