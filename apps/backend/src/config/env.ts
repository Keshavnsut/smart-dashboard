import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  MONGO_URI: z.string().min(1),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().min(1).default('1d'),

  // If set, overrides cookie `secure` attribute.
  // Use `false` for HTTP-only deployments (not recommended).
  COOKIE_SECURE: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === 'true')),

  CORS_ORIGIN: z.string().min(1).default('http://localhost:5173'),
})

export const env = envSchema.parse(process.env)
