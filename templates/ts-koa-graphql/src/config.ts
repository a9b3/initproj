import { pick } from 'lodash'

const defaultConfigs = {
  FB_APP_ID: '',
  FB_APP_SECRET: '',
  MONGO_DB_NAME: 'auth_server',
  MONGO_HOST: 'localhost',
  MONGO_PASS: undefined,
  MONGO_PORT: '27020',
  MONGO_USER: undefined,
  PORT: 5005,
  REDIS_HOST: 'localhost',
  REDIS_PASS: undefined,
  REDIS_PORT: 6380,
  TOKEN_SECRET: 'secret',
}

export default {
  ...defaultConfigs,
  ...pick(process.env as any, Object.keys(defaultConfigs)),
}
