import { Link, NavLink, Outlet } from 'react-router-dom'

import { ThemeToggle } from '../components/ThemeToggle'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

export function DashboardLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-7xl">
        <aside className="hidden w-64 flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:flex">
          <div className="flex items-center justify-between gap-2">
            <Link to="/leads" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Smart Leads
            </Link>
            <ThemeToggle />
          </div>

          <nav className="mt-6 space-y-1">
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                cn(
                  'block rounded-md px-3 py-2 text-sm font-medium',
                  isActive
                    ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100',
                )
              }
            >
              Leads
            </NavLink>
          </nav>

          <div className="mt-auto pt-6">
            <div className="rounded-md border border-slate-200 p-3 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-200">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
              <p className="mt-2 text-xs">
                Role: <span className="font-medium">{user?.role}</span>
              </p>
            </div>
            <Button className="mt-3 w-full" variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
            <Link to="/leads" className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Smart Leads
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="secondary" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  )
}
