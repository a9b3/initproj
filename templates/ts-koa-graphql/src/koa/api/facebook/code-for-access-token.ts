import * as Koa from 'koa'

import * as facebookOauth from 'oauth/facebook'

export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  const { code, redirectUri } = ctx.request.body as {
    code?: string
    redirectUri?: string
  }

  if (!code) {
    throw new Error(`'code' must be provided`)
  }
  if (!redirectUri) {
    throw new Error(`'redirectUri' must be provided`)
  }

  ctx.body = await facebookOauth.codeForAccessToken({ code, redirectUri })
}
