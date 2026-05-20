import { Link, Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

export function AuthLayout() {
  const { user, isLoading } = useAuth()

  if (!isLoading && user) {
    return <Navigate to="/leads" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-md flex-col justify-center">
        <div className="mb-6">
          <Link to="/" className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Smart Leads Dashboard
          </Link>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Secure CRM-style leads tracking with RBAC.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
