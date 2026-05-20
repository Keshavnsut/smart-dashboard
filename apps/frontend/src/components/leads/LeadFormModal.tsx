import { Modal } from '../ui/Modal'

import type { Lead } from '../../types/leads'
import { LeadForm, type LeadFormValues } from './LeadForm'

export function LeadFormModal({
  open,
  mode,
  lead,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean
  mode: 'create' | 'edit'
  lead: Lead | null
  submitting: boolean
  onClose: () => void
  onSubmit: (values: LeadFormValues) => void
}) {
  const title = mode === 'create' ? 'Create Lead' : 'Edit Lead'

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <LeadForm
        defaultValues={lead ?? undefined}
        submitting={submitting}
        submitLabel={mode === 'create' ? 'Create lead' : 'Save changes'}
        onSubmit={onSubmit}
      />
    </Modal>
  )
}
