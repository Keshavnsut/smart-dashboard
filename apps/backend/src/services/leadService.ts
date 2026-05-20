import type { FilterQuery } from 'mongoose'
import mongoose from 'mongoose'

import { ApiError } from '../utils/ApiError'
import { escapeRegExp } from '../utils/regex'
import type { AuthUser } from '../types/auth'
import { LeadSource, LeadStatus, UserRole } from '../types/enums'
import type { LeadEntity } from '../models/Lead'
import {
  createLead,
  deleteLeadById,
  findLeadByIdScoped,
  LEADS_PAGE_SIZE,
  listLeadsAll,
  listLeadsPaged,
  updateLeadScoped,
} from '../repositories/leadRepository'
import { rowsToCsv } from '../utils/csv'

export type LeadSort = 'latest' | 'oldest'

export interface LeadDto {
  id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: Date
}

function toLeadDto(lead: {
  _id: unknown
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: Date
}): LeadDto {
  return {
    id: String(lead._id),
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    createdAt: lead.createdAt,
  }
}

function getScopedFilter(authUser: AuthUser): FilterQuery<LeadEntity> {
  if (authUser.role === UserRole.Admin) {
    return {}
  }

  return { createdBy: new mongoose.Types.ObjectId(authUser.id) }
}

function addQueryFilters(
  filter: FilterQuery<LeadEntity>,
  options: { status?: LeadStatus; source?: LeadSource; search?: string },
) {
  if (options.status) {
    filter.status = options.status
  }
  if (options.source) {
    filter.source = options.source
  }
  if (options.search) {
    const pattern = new RegExp(escapeRegExp(options.search), 'i')
    filter.$or = [{ name: pattern }, { email: pattern }]
  }
}

function sortToDirection(sort: LeadSort): 1 | -1 {
  return sort === 'oldest' ? 1 : -1
}

export async function createLeadForUser(
  authUser: AuthUser,
  input: { name: string; email: string; status: LeadStatus; source: LeadSource },
) {
  const created = await createLead({
    name: input.name,
    email: input.email,
    status: input.status,
    source: input.source,
    createdBy: new mongoose.Types.ObjectId(authUser.id),
  })
  return { lead: toLeadDto(created) }
}

export async function getLeadById(authUser: AuthUser, id: string) {
  const scope = getScopedFilter(authUser)
  const lead = await findLeadByIdScoped(id, scope)
  if (!lead) {
    throw ApiError.notFound('Lead not found')
  }
  return { lead: toLeadDto(lead) }
}

export async function listLeads(
  authUser: AuthUser,
  input: {
    status?: LeadStatus
    source?: LeadSource
    search?: string
    sort: LeadSort
    page: number
  },
) {
  const filter: FilterQuery<LeadEntity> = getScopedFilter(authUser)
  addQueryFilters(filter, { status: input.status, source: input.source, search: input.search })

  const { records, totalRecords } = await listLeadsPaged(filter, {
    sort: sortToDirection(input.sort),
    page: input.page,
  })

  const totalPages = Math.max(1, Math.ceil(totalRecords / LEADS_PAGE_SIZE))
  const currentPage = input.page

  return {
    leads: records.map(toLeadDto),
    pagination: {
      currentPage,
      totalPages,
      totalRecords,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  }
}

export async function updateLead(
  authUser: AuthUser,
  id: string,
  update: Partial<{ name: string; email: string; status: LeadStatus; source: LeadSource }>,
) {
  const scope = getScopedFilter(authUser)
  const updated = await updateLeadScoped(id, scope, update)
  if (!updated) {
    throw ApiError.notFound('Lead not found')
  }
  return { lead: toLeadDto(updated) }
}

export async function deleteLead(authUser: AuthUser, id: string) {
  if (authUser.role !== UserRole.Admin) {
    throw ApiError.forbidden('Only admins can delete leads')
  }
  const deleted = await deleteLeadById(id)
  if (!deleted) {
    throw ApiError.notFound('Lead not found')
  }
  return { ok: true }
}

export async function exportLeadsCsv(
  authUser: AuthUser,
  input: { status?: LeadStatus; source?: LeadSource; search?: string; sort: LeadSort },
) {
  if (authUser.role !== UserRole.Admin) {
    throw ApiError.forbidden('Only admins can export CSV')
  }

  const filter: FilterQuery<LeadEntity> = {}
  addQueryFilters(filter, input)

  const records = await listLeadsAll(filter, { sort: sortToDirection(input.sort) })
  const rows = records.map((l) => ({
    Name: l.name,
    Email: l.email,
    Status: l.status,
    Source: l.source,
    'Created At': new Date(l.createdAt).toISOString(),
  }))

  return { csv: rowsToCsv(rows) }
}
