import type { NextFunction, Request, Response } from 'express'

import type { UserRole } from '../types/enums'
import { ApiError } from '../utils/ApiError'

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role
    if (!role) {
      return next(ApiError.unauthorized('Authentication required'))
    }

    if (!allowedRoles.includes(role)) {
      return next(ApiError.forbidden('Insufficient permissions'))
    }

    return next()
  }
}
