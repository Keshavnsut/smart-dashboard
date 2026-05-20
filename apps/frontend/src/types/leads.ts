export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const
export type LeadStatus = (typeof leadStatuses)[number]

export const leadSources = ['Website', 'Instagram', 'Referral'] as const
export type LeadSource = (typeof leadSources)[number]

export type LeadSort = 'latest' | 'oldest'

export interface Lead {
  id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  createdAt: string
}
