import type { Response } from 'express'

import type { ApiResponse, PaginationMeta } from '../types/api'

export function sendSuccess<TData>(
  res: Response,
  options: {
    statusCode?: number
    message: string
    data?: TData
    pagination?: PaginationMeta
  },
) {
  const payload: ApiResponse<TData> = {
    success: true,
    message: options.message,
    data: options.data,
    pagination: options.pagination,
  }

  return res.status(options.statusCode ?? 200).json(payload)
}

export function sendFailure(
  res: Response,
  options: {
    statusCode: number
    message: string
    details?: unknown
  },
) {
  const payload = {
    success: false,
    message: options.message,
    details: options.details,
  }

  return res.status(options.statusCode).json(payload)
}
