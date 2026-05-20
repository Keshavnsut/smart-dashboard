import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { env } from '../config/env'
import { UserRole } from '../types/enums'
import { ApiError } from '../utils/ApiError'
import { getAccessTokenCookieName } from '../utils/cookies'

function getTokenFromRequest(req: Request): string | undefined {
  const cookieToken = req.cookies?.[getAccessTokenCookieName()] as string | undefined
  if (cookieToken) {
    return cookieToken
  }

  const authHeader = req.headers.authorization
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length)
  }

  return undefined
}

function isUserRole(value: unknown): value is UserRole {
  return value === UserRole.Admin || value === UserRole.Sales
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = getTokenFromRequest(req)
  if (!token) {
    return next(ApiError.unauthorized('Missing access token'))
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload & { role?: unknown }
    const userId = payload.sub
    const role = payload.role

    if (!userId || !isUserRole(role)) {
      return next(ApiError.unauthorized('Invalid access token'))
    }

    req.user = { id: String(userId), role }
    return next()
  } catch {
    return next(ApiError.unauthorized('Invalid or expired access token'))
  }
}
