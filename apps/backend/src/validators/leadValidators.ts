import { z } from 'zod'

import { LeadSource, LeadStatus } from '../types/enums'

export const listLeadsRequestSchema = z.object({
  query: z.object({
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional(),
    search: z.string().trim().min(1).optional(),
    sort: z.enum(['latest', 'oldest']).default('latest'),
    page: z.coerce.number().int().positive().default(1),
  }),
})

export type ListLeadsQuery = z.infer<typeof listLeadsRequestSchema>['query']

export const createLeadRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().transform((v) => v.toLowerCase()),
    status: z.nativeEnum(LeadStatus).default(LeadStatus.New),
    source: z.nativeEnum(LeadSource),
  }),
})

export type CreateLeadBody = z.infer<typeof createLeadRequestSchema>['body']

export const updateLeadRequestSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().trim().min(1).max(120).optional(),
      email: z.string().trim().email().transform((v) => v.toLowerCase()).optional(),
      status: z.nativeEnum(LeadStatus).optional(),
      source: z.nativeEnum(LeadSource).optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'At least one field is required',
    }),
})

export type UpdateLeadParams = z.infer<typeof updateLeadRequestSchema>['params']
export type UpdateLeadBody = z.infer<typeof updateLeadRequestSchema>['body']

export const leadIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
})

export type LeadIdParams = z.infer<typeof leadIdParamSchema>['params']
