import { cn } from '../../utils/cn'
import type { LeadStatus } from '../../types/leads'

function statusStyles(status: LeadStatus) {
  switch (status) {
    case 'New':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
    case 'Contacted':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
    case 'Qualified':
      return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200'
    case 'Lost':
      return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
  }
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', statusStyles(status))}>
      {status}
    </span>
  )
}
