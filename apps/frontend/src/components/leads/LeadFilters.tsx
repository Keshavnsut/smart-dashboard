import type { LeadSort, LeadSource, LeadStatus } from '../../types/leads'
import { leadSources, leadStatuses } from '../../types/leads'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

export function LeadFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sort,
  onSortChange,
}: {
  search: string
  onSearchChange: (value: string) => void
  status: LeadStatus | ''
  onStatusChange: (value: LeadStatus | '') => void
  source: LeadSource | ''
  onSourceChange: (value: LeadSource | '') => void
  sort: LeadSort
  onSortChange: (value: LeadSort) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
      <div className="md:col-span-6">
        <Input
          label="Search"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="md:col-span-2">
        <Select
          label="Status"
          value={status}
          onChange={(v) => onStatusChange(v as LeadStatus | '')}
          options={[
            { label: 'All', value: '' },
            ...leadStatuses.map((s) => ({ label: s, value: s })),
          ]}
        />
      </div>

      <div className="md:col-span-2">
        <Select
          label="Source"
          value={source}
          onChange={(v) => onSourceChange(v as LeadSource | '')}
          options={[
            { label: 'All', value: '' },
            ...leadSources.map((s) => ({ label: s, value: s })),
          ]}
        />
      </div>

      <div className="md:col-span-2">
        <Select
          label="Sort"
          value={sort}
          onChange={(v) => onSortChange(v as LeadSort)}
          options={[
            { label: 'Latest', value: 'latest' },
            { label: 'Oldest', value: 'oldest' },
          ]}
        />
      </div>
    </div>
  )
}
