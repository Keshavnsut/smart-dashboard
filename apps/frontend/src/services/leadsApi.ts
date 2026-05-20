import type { ApiResponse, PaginationMeta } from '../types/api'
import type { Lead, LeadSort, LeadSource, LeadStatus } from '../types/leads'
import { http } from './http'

export interface LeadsListParams {
  status?: LeadStatus
  source?: LeadSource
  search?: string
  sort?: LeadSort
  page?: number
}

function unwrap<T>(res: ApiResponse<T>) {
  if (!res.success) {
    throw new Error(res.message)
  }
  return res
}

export async function listLeads(params: LeadsListParams) {
  const res = await http.get<ApiResponse<Lead[]>>('/leads', { params })
  const unwrapped = unwrap(res.data)
  return {
    leads: unwrapped.data ?? [],
    pagination: unwrapped.pagination as PaginationMeta,
  }
}

export async function getLead(id: string) {
  const res = await http.get<ApiResponse<Lead>>(`/leads/${id}`)
  const unwrapped = unwrap(res.data)
  if (!unwrapped.data) {
    throw new Error('Lead not found')
  }
  return unwrapped.data
}

export type CreateLeadInput = Pick<Lead, 'name' | 'email' | 'status' | 'source'>
export type UpdateLeadInput = Partial<CreateLeadInput>

export async function createLead(input: CreateLeadInput) {
  const res = await http.post<ApiResponse<Lead>>('/leads', input)
  const unwrapped = unwrap(res.data)
  if (!unwrapped.data) {
    throw new Error('Malformed API response')
  }
  return unwrapped.data
}

export async function updateLead(id: string, input: UpdateLeadInput) {
  const res = await http.patch<ApiResponse<Lead>>(`/leads/${id}`, input)
  const unwrapped = unwrap(res.data)
  if (!unwrapped.data) {
    throw new Error('Malformed API response')
  }
  return unwrapped.data
}

export async function deleteLead(id: string) {
  const res = await http.delete<ApiResponse<unknown>>(`/leads/${id}`)
  unwrap(res.data)
}

export async function exportLeadsCsv(params: Omit<LeadsListParams, 'page'>) {
  const res = await http.get('/leads/export/csv', {
    params,
    responseType: 'blob',
  })

  return res.data as Blob
}
