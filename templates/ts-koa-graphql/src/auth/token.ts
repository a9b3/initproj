import config from 'config'
import * as jsonwebtoken from 'jsonwebtoken'
import * as redis from 'redis-client'

// TODO might want to move these to config
const TOKEN_EXPIRE_WEEK = 1
const TOKEN_EXPIRE_DAY = TOKEN_EXPIRE_WEEK * 7
const TOKEN_EXPIRE_HOUR = TOKEN_EXPIRE_DAY * 24
const TOKEN_EXPIRE_MIN = TOKEN_EXPIRE_HOUR * 60
const TOKEN_EXPIRE_SEC = TOKEN_EXPIRE_MIN * 60

/**
 * create will create token in redis for the given user
 */
export async function create({
  email,
  id,
  ttl = TOKEN_EXPIRE_SEC,
  ip,
  userAgent,
}: {
  email: string
  id: string
  ttl?: number
  ip?: string
  userAgent?: string
}) {
  const jwt = jsonwebtoken.sign(
    { email, id, ttl, ip, userAgent },
    config.TOKEN_SECRET,
    { expiresIn: ttl },
  )
  await redis.getClient().setexAsync(getRedisKey(id, jwt), ttl, 'true')
  return jwt
}

/**
 * invalidate will remove given jwt from datastore
 */
export async function invalidate({ jwt }: { jwt: string }) {
  if (!jwt) {
    return
  }
  const decoded: any = jsonwebtoken.decode(jwt)
  await redis.getClient().delAsync(getRedisKey(decoded.id, jwt))
}

/**
 * verify checks given jwt against redis
 */
export async function verify({ jwt }: { jwt: string }) {
  try {
    const decoded: any = jsonwebtoken.verify(jwt, config.TOKEN_SECRET)
    const found = await redis.getClient().getAsync(getRedisKey(decoded.id, jwt))
    return Boolean(found)
  } catch (err) {
    return false
  }
}

/**
 * getUserTokens will return valid tokens associated with the user
 */
export async function getUserTokens({ jwt }: { jwt: string }) {
  const decoded: any = jsonwebtoken.verify(jwt, config.TOKEN_SECRET)
  return redis.getClient().keysAsync(`${decoded.id}*`)
}

/**
 * invalidateAllOtherTokens will invalidate all other tokens associated with
 * user
 */
export async function invalidateAllOtherTokens({ jwt }: { jwt: string }) {
  const tokens = await getUserTokens({ jwt })
  for (const token of tokens) {
    const parsed = parseRedisKey(token)
    if (parsed.jwt === jwt) {
      continue
    }

    await invalidate({ jwt: parsed.jwt })
  }
}

export function parseBearerJwt(str: string) {
  const tokens = str.split(' ')
  if (tokens[0] !== 'Bearer') {
    throw new Error(`jwt must be in following format 'Bearer <jwt>'`)
  }
  return tokens[1]
}

export function decodeJwt(jwt: string) {
  const decoded: any = jsonwebtoken.verify(jwt, config.TOKEN_SECRET)
  return decoded
}

export function parseRedisKey(key: string) {
  return {
    id: key.split(':')[0],
    jwt: key.split(':')[1],
  }
}

function getRedisKey(id: string, jwt: string) {
  return `${id}:${jwt}`
}
