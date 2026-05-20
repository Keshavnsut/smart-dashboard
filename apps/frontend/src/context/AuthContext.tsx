/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

import type { User } from '../types/auth'
import * as authApi from '../services/authApi'

interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (input: authApi.LoginInput) => Promise<void>
  register: (input: authApi.RegisterInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    authApi
      .me()
      .then((me) => {
        if (!mounted) return
        setUser(me)
      })
      .catch(() => {
        if (!mounted) return
        setUser(null)
      })
      .finally(() => {
        if (!mounted) return
        setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login: async (input) => {
        const loggedIn = await authApi.login(input)
        setUser(loggedIn)
        toast.success('Welcome back')
      },
      register: async (input) => {
        const created = await authApi.register(input)
        setUser(created)
        toast.success('Account created')
      },
      logout: async () => {
        await authApi.logout()
        setUser(null)
        queryClient.clear()
        toast.success('Logged out')
      },
    }),
    [user, isLoading, queryClient],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
