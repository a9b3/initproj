import * as Koa from 'koa'

import * as facebookOauth from 'oauth/facebook'

export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  const { accessToken } = ctx.request.body as {
    accessToken?: string
  }

  if (!accessToken) {
    throw new Error(`'accessToken' must be provided`)
  }

  ctx.body = await facebookOauth.register({ accessToken })
}
