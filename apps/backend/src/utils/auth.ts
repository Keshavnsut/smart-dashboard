import type { Request } from 'express'

import { ApiError } from './ApiError'
import type { AuthUser } from '../types/auth'

export function getAuthUser(req: Request): AuthUser {
  if (!req.user) {
    throw ApiError.unauthorized('Authentication required')
  }
  return req.user
}
