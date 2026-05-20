import { Router } from 'express'

import { authRouter } from './authRoutes'
import { leadRouter } from './leadRoutes'

export const apiRouter = Router()

apiRouter.use('/auth', authRouter)
apiRouter.use('/leads', leadRouter)
