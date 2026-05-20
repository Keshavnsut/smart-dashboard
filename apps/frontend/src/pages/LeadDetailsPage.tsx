import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

import { Button } from '../components/ui/Button'
import { Spinner } from '../components/ui/Spinner'
import { StatusBadge } from '../components/ui/Badge'
import * as leadsApi from '../services/leadsApi'
import { getErrorMessage } from '../utils/errors'

export function LeadDetailsPage() {
  const { id } = useParams()

  const leadQuery = useQuery({
    queryKey: ['lead', id],
    enabled: Boolean(id),
    queryFn: () => leadsApi.getLead(id as string),
  })

  if (leadQuery.isLoading) {
    return (
      <div className="grid place-items-center rounded-lg border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-900">
        <Spinner className="h-6 w-6" />
      </div>
    )
  }

  if (leadQuery.isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-white p-6 text-red-700 dark:border-red-900/40 dark:bg-slate-900 dark:text-red-300">
        Failed to load lead: {getErrorMessage(leadQuery.error)}
      </div>
    )
  }

  const lead = leadQuery.data
  if (!lead) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        Lead not found.
      </div>
    )
  }

  const onCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success('Copied')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Lead Details</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">View lead information.</p>
        </div>
        <Link to="/leads">
          <Button variant="secondary">Back</Button>
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{lead.name}</p>
            <p className="text-slate-600 dark:text-slate-300">{lead.email}</p>
          </div>
          <StatusBadge status={lead.status} />
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Source</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">{lead.source}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-500 dark:text-slate-400">Created</dt>
            <dd className="mt-1 font-medium text-slate-900 dark:text-slate-100">
              {new Date(lead.createdAt).toLocaleString()}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => onCopy(lead.email)}>
            Copy Email
          </Button>
          <Button variant="secondary" onClick={() => onCopy(lead.name)}>
            Copy Name
          </Button>
        </div>
      </div>
    </div>
  )
}
