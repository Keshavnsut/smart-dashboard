import jwt, { type SignOptions } from 'jsonwebtoken'

import { env } from '../config/env'
import { ApiError } from '../utils/ApiError'
import { UserRole } from '../types/enums'
import { countUsers, createUser, findUserByEmail, findUserById } from '../repositories/userRepository'

export interface UserDto {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
}

function toUserDto(user: { _id: unknown; name: string; email: string; role: UserRole; createdAt: Date }): UserDto {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  }
}

function signAccessToken(user: { id: string; role: UserRole }) {
  return jwt.sign({ role: user.role }, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  })
}

export async function register(input: { name: string; email: string; password: string }) {
  const existing = await findUserByEmail(input.email)
  if (existing) {
    throw ApiError.conflict('Email is already registered')
  }

  const userCount = await countUsers()
  const role = userCount === 0 ? UserRole.Admin : UserRole.Sales

  const created = await createUser({
    name: input.name,
    email: input.email,
    password: input.password,
    role,
  })

  const token = signAccessToken({ id: String(created._id), role: created.role })
  return { user: toUserDto(created), token }
}

export async function login(input: { email: string; password: string }) {
  const user = await findUserByEmail(input.email, { includePassword: true })
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const ok = await user.comparePassword(input.password)
  if (!ok) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  const token = signAccessToken({ id: String(user._id), role: user.role })
  return { user: toUserDto(user), token }
}

export async function getMe(userId: string) {
  const user = await findUserById(userId)
  if (!user) {
    throw ApiError.unauthorized('User not found')
  }
  return { user: toUserDto(user) }
}
