import axios from 'axios'
import * as qs from 'qs'
import * as uuid from 'uuid'

import * as auth from 'auth'
import * as token from 'auth/token'
import config from 'config'
import User from 'mongodb/models/user'

export async function register({ accessToken }: { accessToken: string }) {
  const { user_id } = await debugAccessToken(accessToken)
  const { email, id } = await getUserInfo({ accessToken, id: user_id })

  // create a random password for the user, they can choose to change their
  // password later
  return auth.register({ email, password: uuid.v4(), facebook: { id } })
}

export async function authenticate({
  accessToken,
  ip,
  userAgent,
}: {
  accessToken: string
  ip?: string
  userAgent?: string
}) {
  const { user_id } = await debugAccessToken(accessToken)
  const { email } = await getUserInfo({ accessToken, id: user_id })

  const found = await User.findOne({ email })
  if (!found) {
    throw new Error(`${email} does not exist.`)
  }

  return token.create({
    email,
    id: found.id,
    ip,
    userAgent,
  })
}

// obj -> { access_token, token_type, expires_in (seconds) }
export async function codeForAccessToken({
  code,
  redirectUri,
}: {
  code: string
  redirectUri: string
}) {
  const { data } = await axios.get(
    `https://graph.facebook.com/v3.2/oauth/access_token?${qs.stringify({
      client_id: config.FB_APP_ID,
      client_secret: config.FB_APP_SECRET,
      code,
      redirect_uri: redirectUri,
    })}`,
  )

  return data
}

// obj -> {
//   app_id: '115229942540274',
//   application: 'Hello',
//   expires_at: 1508980863,
//   is_valid: true,
//   issued_at: 1503796863,
//   scopes: [ 'user_about_me', 'email', 'public_profile' ],
//   user_id: '10211876340198113'
// }
async function debugAccessToken(accessToken: string) {
  const {
    data: { data },
  } = await axios.get(
    `https://graph.facebook.com/debug_token?${qs.stringify({
      access_token: config.FB_APP_ID + '|' + config.FB_APP_SECRET,
      input_token: accessToken,
    })}`,
  )

  return data
}

// obj -> { email: string , id: string }
async function getUserInfo({
  accessToken,
  id,
}: {
  accessToken: string
  id: string
}) {
  const { data } = await axios.get(
    `https://graph.facebook.com/v3.2/${id}?${qs.stringify({
      access_token: accessToken,
      fields: 'email',
    })}`,
  )

  return data
}
