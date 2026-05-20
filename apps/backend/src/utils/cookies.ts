import type { Response } from 'express'

import { env } from '../config/env'

const ACCESS_TOKEN_COOKIE = 'accessToken'

function getCookieBaseOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
  }
}

export function getAccessTokenCookieName() {
  return ACCESS_TOKEN_COOKIE
}

export function setAccessTokenCookie(res: Response, token: string) {
  res.cookie(ACCESS_TOKEN_COOKIE, token, {
    ...getCookieBaseOptions(),
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  })
}

export function clearAccessTokenCookie(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE, getCookieBaseOptions())
}
