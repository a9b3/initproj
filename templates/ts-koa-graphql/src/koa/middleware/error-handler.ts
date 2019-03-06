import * as Koa from 'koa'

// https://github.com/koajs/koa/wiki/Error-Handling
export default async function(ctx: Koa.Context, next: () => Promise<any>) {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = { message: err.message }
    ctx.app.emit('error', err, ctx)
  }
}
