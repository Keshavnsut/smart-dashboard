import { Router } from 'express'

import * as leadController from '../controllers/leadController'
import { requireAuth } from '../middleware/authMiddleware'
import { requireRole } from '../middleware/roleMiddleware'
import { validateRequest } from '../middleware/validateRequest'
import { asyncHandler } from '../utils/asyncHandler'
import { UserRole } from '../types/enums'
import {
  createLeadRequestSchema,
  leadIdParamSchema,
  listLeadsRequestSchema,
  updateLeadRequestSchema,
} from '../validators/leadValidators'

export const leadRouter = Router()

leadRouter.use(requireAuth)

leadRouter.get('/export/csv',
  requireRole(UserRole.Admin),
  validateRequest(listLeadsRequestSchema),
  asyncHandler(leadController.exportCsv),
)

leadRouter.get('/', validateRequest(listLeadsRequestSchema), asyncHandler(leadController.listLeads))
leadRouter.post('/', validateRequest(createLeadRequestSchema), asyncHandler(leadController.createLead))

leadRouter.get('/:id', validateRequest(leadIdParamSchema), asyncHandler(leadController.getLead))
leadRouter.patch('/:id', validateRequest(updateLeadRequestSchema), asyncHandler(leadController.updateLead))
leadRouter.delete(
  '/:id',
  requireRole(UserRole.Admin),
  validateRequest(leadIdParamSchema),
  asyncHandler(leadController.deleteLead),
)
