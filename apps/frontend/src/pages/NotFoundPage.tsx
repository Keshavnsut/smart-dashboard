import { Link } from 'react-router-dom'

import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Page not found</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">The page you requested does not exist.</p>
        <div className="mt-4">
          <Link to="/leads">
            <Button>Go to Leads</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
