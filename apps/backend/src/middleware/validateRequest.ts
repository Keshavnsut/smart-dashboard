import type { NextFunction, Request, Response } from 'express'
import type { ZodTypeAny } from 'zod'

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as {
        body?: unknown
        query?: unknown
        params?: unknown
      }

      if (parsed.body !== undefined) {
        req.body = parsed.body
      }
      if (parsed.query !== undefined) {
        req.query = parsed.query as typeof req.query
      }
      if (parsed.params !== undefined) {
        req.params = parsed.params as typeof req.params
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}
