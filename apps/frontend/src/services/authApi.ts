import type { AxiosError } from 'axios'
import axios from 'axios'

import type { ApiResponse } from '../types/api'
import type { User } from '../types/auth'
import { http } from './http'

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

function unwrap<T>(res: ApiResponse<T>) {
  if (!res.success) {
    throw new Error(res.message)
  }
  if (res.data === undefined) {
    throw new Error('Malformed API response')
  }
  return res.data
}

export async function register(input: RegisterInput) {
  const res = await http.post<ApiResponse<User>>('/auth/register', input)
  return unwrap(res.data)
}

export async function login(input: LoginInput) {
  const res = await http.post<ApiResponse<User>>('/auth/login', input)
  return unwrap(res.data)
}

export async function logout() {
  await http.post('/auth/logout')
}

export async function me() {
  try {
    const res = await http.get<ApiResponse<User>>('/auth/me')
    return unwrap(res.data)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError
      if (axiosErr.response?.status === 401) {
        return null
      }
    }
    throw err
  }
}
