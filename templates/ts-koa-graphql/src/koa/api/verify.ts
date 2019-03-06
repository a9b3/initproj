import * as Koa from 'koa'

import * as token from 'auth/token'

export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  const { jwt } = ctx.request.body as {
    jwt?: string
  }

  if (!jwt) {
    throw new Error(`'jwt' must be provided`)
  }

  ctx.body = await token.verify({ jwt })
}
