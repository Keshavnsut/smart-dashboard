import { z } from 'zod'

export const registerRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().transform((v) => v.toLowerCase()),
    password: z.string().min(8).max(72),
  }),
})

export type RegisterBody = z.infer<typeof registerRequestSchema>['body']

export const loginRequestSchema = z.object({
  body: z.object({
    email: z.string().trim().email().transform((v) => v.toLowerCase()),
    password: z.string().min(1).max(72),
  }),
})

export type LoginBody = z.infer<typeof loginRequestSchema>['body']
