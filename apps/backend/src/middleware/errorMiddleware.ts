import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { ZodError } from 'zod'

import { env } from '../config/env'
import { ApiError } from '../utils/ApiError'
import { sendFailure } from '../utils/response'

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.method} ${req.path} not found`))
}

function isMongoDuplicateKeyError(err: unknown): err is { code: number; keyValue?: unknown } {
  return typeof err === 'object' && err !== null && 'code' in err && (err as { code: unknown }).code === 11000
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return sendFailure(res, {
      statusCode: err.statusCode,
      message: err.message,
      details: env.NODE_ENV === 'production' ? undefined : err.details,
    })
  }

  if (err instanceof ZodError) {
    return sendFailure(res, {
      statusCode: 400,
      message: 'Validation failed',
      details: env.NODE_ENV === 'production' ? undefined : err.flatten(),
    })
  }

  if (err instanceof mongoose.Error.CastError) {
    return sendFailure(res, {
      statusCode: 400,
      message: 'Invalid request parameter',
      details: env.NODE_ENV === 'production' ? undefined : { path: err.path, value: err.value },
    })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return sendFailure(res, {
      statusCode: 400,
      message: 'Validation failed',
      details: env.NODE_ENV === 'production' ? undefined : err.errors,
    })
  }

  if (isMongoDuplicateKeyError(err)) {
    return sendFailure(res, {
      statusCode: 409,
      message: 'Duplicate key error',
      details: env.NODE_ENV === 'production' ? undefined : err.keyValue,
    })
  }

  console.error('[backend] unhandled error', err)

  return sendFailure(res, {
    statusCode: 500,
    message: 'Internal server error',
    details: env.NODE_ENV === 'production' ? undefined : err,
  })
}
