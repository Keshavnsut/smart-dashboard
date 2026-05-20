import type { FilterQuery } from 'mongoose'

import { LeadModel, type ILead, type LeadEntity } from '../models/Lead'

export const LEADS_PAGE_SIZE = 10

export async function createLead(input: Pick<ILead, 'name' | 'email' | 'status' | 'source' | 'createdBy'>) {
  return LeadModel.create(input)
}

export async function findLeadByIdScoped(id: string, scope: FilterQuery<LeadEntity>) {
  return LeadModel.findOne({ _id: id, ...scope })
    .select('name email status source createdAt createdBy')
    .lean()
    .exec()
}

export async function updateLeadScoped(
  id: string,
  scope: FilterQuery<LeadEntity>,
  update: Partial<Pick<ILead, 'name' | 'email' | 'status' | 'source'>>,
) {
  return LeadModel.findOneAndUpdate({ _id: id, ...scope }, update, {
    new: true,
  })
    .select('name email status source createdAt createdBy')
    .lean()
    .exec()
}

export async function deleteLeadById(id: string) {
  return LeadModel.findByIdAndDelete(id).exec()
}

export async function listLeadsPaged(scope: FilterQuery<LeadEntity>, options: { sort: 1 | -1; page: number }) {
  const skip = (options.page - 1) * LEADS_PAGE_SIZE

  const [records, totalRecords] = await Promise.all([
    LeadModel.find(scope)
      .sort({ createdAt: options.sort })
      .skip(skip)
      .limit(LEADS_PAGE_SIZE)
      .select('name email status source createdAt createdBy')
      .lean()
      .exec(),
    LeadModel.countDocuments(scope).exec(),
  ])

  return { records, totalRecords }
}

export async function listLeadsAll(scope: FilterQuery<LeadEntity>, options: { sort: 1 | -1 }) {
  return LeadModel.find(scope)
    .sort({ createdAt: options.sort })
    .select('name email status source createdAt createdBy')
    .lean()
    .exec()
}
