import { Link } from 'react-router-dom'

import type { Lead } from '../../types/leads'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/Badge'

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

export function LeadTable({
  leads,
  canDelete,
  onEdit,
  onDelete,
  deletingId,
}: {
  leads: Lead[]
  canDelete: boolean
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
  deletingId: string | null
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Source</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-950">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">{lead.name}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{lead.email}</td>
              <td className="px-4 py-3">
                <StatusBadge status={lead.status} />
              </td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{lead.source}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatDate(lead.createdAt)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Link to={`/leads/${lead.id}`}>
                    <Button variant="secondary" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm" onClick={() => onEdit(lead)}>
                    Edit
                  </Button>
                  {canDelete ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(lead)}
                      disabled={deletingId === lead.id}
                    >
                      {deletingId === lead.id ? 'Deleting…' : 'Delete'}
                    </Button>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
