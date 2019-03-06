import * as Router from 'koa-router'

import authenticate from 'koa/api/authenticate'
import healthz from 'koa/api/healthz'
import invalidate from 'koa/api/invalidate'
import register from 'koa/api/register'
import verify from 'koa/api/verify'

import fbAuthenticate from 'koa/api/facebook/authenticate'
import codeForAccessToken from 'koa/api/facebook/code-for-access-token'
import fbRegister from 'koa/api/facebook/register'

const router = new Router()

router.get('/', healthz)
router.get('/healthz', healthz)

router.post('/api/register', register)
router.post('/api/authenticate', authenticate)
router.post('/api/verify', verify)
router.post('/api/invalidate', invalidate)

router.post('/api/facebook/register', fbRegister)
router.post('/api/facebook/authenticate', fbAuthenticate)
router.post('/api/facebook/code-for-access-token', codeForAccessToken)

export default router
