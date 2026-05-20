import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

import { LeadFilters } from '../components/leads/LeadFilters'
import { LeadFormModal } from '../components/leads/LeadFormModal'
import type { LeadFormValues } from '../components/leads/LeadForm'
import { LeadTable } from '../components/leads/LeadTable'
import { Button } from '../components/ui/Button'
import { Pagination } from '../components/ui/Pagination'
import { Spinner } from '../components/ui/Spinner'
import { useAuth } from '../context/AuthContext'
import { useDebounce } from '../hooks/useDebounce'
import type { Lead, LeadSort, LeadSource, LeadStatus } from '../types/leads'
import * as leadsApi from '../services/leadsApi'
import { downloadBlob } from '../utils/download'
import { getErrorMessage } from '../utils/errors'

export function LeadsPage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [searchInput, setSearchInput] = useState('')
  const search = useDebounce(searchInput, 450)
  const [status, setStatus] = useState<LeadStatus | ''>('')
  const [source, setSource] = useState<LeadSource | ''>('')
  const [sort, setSort] = useState<LeadSort>('latest')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isAdmin = user?.role === 'admin'

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    setPage(1)
  }

  const handleStatusChange = (value: LeadStatus | '') => {
    setStatus(value)
    setPage(1)
  }

  const handleSourceChange = (value: LeadSource | '') => {
    setSource(value)
    setPage(1)
  }

  const handleSortChange = (value: LeadSort) => {
    setSort(value)
    setPage(1)
  }

  const params = useMemo(() => {
    return {
      search: search ? search : undefined,
      status: status || undefined,
      source: source || undefined,
      sort,
      page,
    }
  }, [search, status, source, sort, page])

  const leadsQuery = useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsApi.listLeads(params),
    placeholderData: keepPreviousData,
  })

  const createMutation = useMutation({
    mutationFn: (input: leadsApi.CreateLeadInput) => leadsApi.createLead(input),
    onSuccess: async () => {
      toast.success('Lead created')
      await queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const updateMutation = useMutation({
    mutationFn: (args: { id: string; input: leadsApi.UpdateLeadInput }) =>
      leadsApi.updateLead(args.id, args.input),
    onSuccess: async () => {
      toast.success('Lead updated')
      await queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: async () => {
      toast.success('Lead deleted')
      await queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
    onSettled: () => setDeletingId(null),
  })

  const isSaving = createMutation.isPending || updateMutation.isPending

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (lead: Lead) => {
    setEditing(lead)
    setModalOpen(true)
  }

  const handleSave = async (values: LeadFormValues) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, input: values })
    } else {
      await createMutation.mutateAsync(values)
    }
    setModalOpen(false)
  }

  const handleDelete = async (lead: Lead) => {
    if (!isAdmin) return
    const ok = window.confirm(`Delete lead "${lead.name}"? This cannot be undone.`)
    if (!ok) return

    setDeletingId(lead.id)
    await deleteMutation.mutateAsync(lead.id)
  }

  const handleExport = async () => {
    if (!isAdmin) return
    try {
      const blob = await leadsApi.exportLeadsCsv({
        status: status || undefined,
        source: source || undefined,
        search: search || undefined,
        sort,
      })
      downloadBlob(blob, 'leads.csv')
      toast.success('CSV downloaded')
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Leads</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Filter, search, and manage your pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <Button variant="secondary" onClick={handleExport} disabled={leadsQuery.isLoading}>
              Export CSV
            </Button>
          ) : null}
          <Button onClick={openCreate}>Create Lead</Button>
        </div>
      </div>

      <LeadFilters
        search={searchInput}
        onSearchChange={handleSearchChange}
        status={status}
        onStatusChange={handleStatusChange}
        source={source}
        onSourceChange={handleSourceChange}
        sort={sort}
        onSortChange={handleSortChange}
      />

      {leadsQuery.isLoading ? (
        <div className="grid place-items-center rounded-lg border border-slate-200 bg-white p-10 dark:border-slate-800 dark:bg-slate-900">
          <Spinner className="h-6 w-6" />
        </div>
      ) : leadsQuery.isError ? (
        <div className="rounded-lg border border-red-200 bg-white p-6 text-red-700 dark:border-red-900/40 dark:bg-slate-900 dark:text-red-300">
          Failed to load leads: {getErrorMessage(leadsQuery.error)}
        </div>
      ) : leadsQuery.data?.leads.length ? (
        <LeadTable
          leads={leadsQuery.data.leads}
          canDelete={isAdmin}
          onEdit={openEdit}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-700 dark:text-slate-200">No leads found.</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try adjusting filters or create a new lead.
          </p>
          <div className="mt-4">
            <Button onClick={openCreate}>Create Lead</Button>
          </div>
        </div>
      )}

      {leadsQuery.data?.pagination ? (
        <Pagination pagination={leadsQuery.data.pagination} onPageChange={setPage} />
      ) : null}

      <LeadFormModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        lead={editing}
        submitting={isSaving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  )
}
