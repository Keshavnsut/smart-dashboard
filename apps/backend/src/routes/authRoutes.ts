import { Router } from 'express'

import * as authController from '../controllers/authController'
import { requireAuth } from '../middleware/authMiddleware'
import { validateRequest } from '../middleware/validateRequest'
import { asyncHandler } from '../utils/asyncHandler'
import { loginRequestSchema, registerRequestSchema } from '../validators/authValidators'

export const authRouter = Router()

authRouter.post('/register', validateRequest(registerRequestSchema), asyncHandler(authController.register))
authRouter.post('/login', validateRequest(loginRequestSchema), asyncHandler(authController.login))
authRouter.post('/logout', asyncHandler(authController.logout))
authRouter.get('/me', requireAuth, asyncHandler(authController.me))
