import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { leadSources, leadStatuses, type LeadSource, type LeadStatus } from '../../types/leads'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Enter a valid email'),
  status: z.enum(leadStatuses),
  source: z.enum(leadSources),
})

export type LeadFormValues = z.infer<typeof schema>

export function LeadForm({
  defaultValues,
  submitting,
  submitLabel,
  onSubmit,
}: {
  defaultValues?: Partial<LeadFormValues>
  submitting: boolean
  submitLabel: string
  onSubmit: (values: LeadFormValues) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      email: defaultValues?.email ?? '',
      status: (defaultValues?.status as LeadStatus) ?? 'New',
      source: (defaultValues?.source as LeadSource) ?? 'Website',
    },
  })

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</p>
          <select
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-slate-700"
            {...register('status')}
          >
            {leadStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Source</p>
          <select
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-slate-700"
            {...register('source')}
          >
            {leadSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  )
}
