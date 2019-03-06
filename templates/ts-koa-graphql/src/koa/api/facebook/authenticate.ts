import * as Koa from 'koa'

import * as facebookOauth from 'oauth/facebook'

export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  const { accessToken } = ctx.request.body as {
    accessToken?: string
  }

  if (!accessToken) {
    throw new Error(`'accessToken' must be provided`)
  }

  ctx.body = await facebookOauth.authenticate({
    accessToken,
    ip: ctx.req.headers['x-forwarded-for'] as any,
    userAgent: ctx.req.headers['user-agent'] as any,
  })
}
