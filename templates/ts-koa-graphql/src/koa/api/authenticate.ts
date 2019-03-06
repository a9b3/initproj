import * as Koa from 'koa'

import * as auth from 'auth'

export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  const { email, password } = ctx.request.body as {
    email?: string
    password?: string
  }

  if (!email) {
    throw new Error(`'email' must be provided`)
  }
  if (!password) {
    throw new Error(`'password' must be provided`)
  }

  const jwt = await auth.authenticate({ email, password })

  ctx.body = { jwt }
}
