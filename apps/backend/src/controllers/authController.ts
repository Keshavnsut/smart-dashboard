import type { Request, Response } from 'express'

import { clearAccessTokenCookie, setAccessTokenCookie } from '../utils/cookies'
import { getAuthUser } from '../utils/auth'
import { sendSuccess } from '../utils/response'
import * as authService from '../services/authService'
import type { LoginBody, RegisterBody } from '../validators/authValidators'

export async function register(req: Request, res: Response) {
  const { user, token } = await authService.register(req.body as RegisterBody)
  setAccessTokenCookie(res, token)
  return sendSuccess(res, { statusCode: 201, message: 'User registered successfully', data: user })
}

export async function login(req: Request, res: Response) {
  const { user, token } = await authService.login(req.body as LoginBody)
  setAccessTokenCookie(res, token)
  return sendSuccess(res, { message: 'Login successful', data: user })
}

export async function logout(req: Request, res: Response) {
  // Ensure token is cleared even if the caller is already logged out.
  clearAccessTokenCookie(res)
  return sendSuccess(res, { message: 'Logged out successfully' })
}

export async function me(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const { user } = await authService.getMe(authUser.id)
  return sendSuccess(res, { message: 'User fetched successfully', data: user })
}
