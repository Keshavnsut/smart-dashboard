import { createApp } from './app'
import { connectToDatabase } from './config/db'
import { env } from './config/env'

async function bootstrap() {
  await connectToDatabase()

  const app = createApp()
  const server = app.listen(env.PORT, () => {
    console.log(`[backend] listening on :${env.PORT}`)
  })

  const shutdown = async (signal: string) => {
    console.log(`[backend] received ${signal}, shutting down...`)
    server.close(() => process.exit(0))
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

bootstrap().catch((err) => {
  console.error('[backend] failed to start', err)
  process.exit(1)
})
