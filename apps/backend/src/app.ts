import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'

import { env } from './config/env'
import { errorHandler, notFound } from './middleware/errorMiddleware'
import { apiRouter } from './routes'

export function createApp() {
  const app = express()

  app.set('trust proxy', 1)

  app.use(helmet())
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  if (env.NODE_ENV !== 'production') {
    app.use(morgan('dev'))
  }

  const allowedOrigins = env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    }),
  )

  app.get('/health', (_req, res) => res.status(200).json({ ok: true }))
  app.use('/api', apiRouter)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
