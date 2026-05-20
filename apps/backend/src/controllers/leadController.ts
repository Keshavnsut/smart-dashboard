import type { Request, Response } from 'express'

import { getAuthUser } from '../utils/auth'
import { sendSuccess } from '../utils/response'
import * as leadService from '../services/leadService'
import type {
  CreateLeadBody,
  LeadIdParams,
  ListLeadsQuery,
  UpdateLeadBody,
  UpdateLeadParams,
} from '../validators/leadValidators'

export async function createLead(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const body = req.body as CreateLeadBody
  const { lead } = await leadService.createLeadForUser(authUser, body)
  return sendSuccess(res, { statusCode: 201, message: 'Lead created successfully', data: lead })
}

export async function listLeads(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const query = req.query as unknown as ListLeadsQuery
  const { leads, pagination } = await leadService.listLeads(authUser, query)
  return sendSuccess(res, { message: 'Leads fetched successfully', data: leads, pagination })
}

export async function getLead(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const { id } = req.params as unknown as LeadIdParams
  const { lead } = await leadService.getLeadById(authUser, id)
  return sendSuccess(res, { message: 'Lead fetched successfully', data: lead })
}

export async function updateLead(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const { id } = req.params as unknown as UpdateLeadParams
  const body = req.body as UpdateLeadBody
  const { lead } = await leadService.updateLead(authUser, id, body)
  return sendSuccess(res, { message: 'Lead updated successfully', data: lead })
}

export async function deleteLead(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const { id } = req.params as unknown as LeadIdParams
  await leadService.deleteLead(authUser, id)
  return sendSuccess(res, { message: 'Lead deleted successfully' })
}

export async function exportCsv(req: Request, res: Response) {
  const authUser = getAuthUser(req)
  const query = req.query as unknown as ListLeadsQuery
  const { status, source, search, sort } = query
  const { csv } = await leadService.exportLeadsCsv(authUser, { status, source, search, sort })

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
  res.status(200).send(csv)
}
