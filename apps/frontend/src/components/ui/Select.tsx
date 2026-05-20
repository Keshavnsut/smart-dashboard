import { cn } from '../../utils/cn'

export interface SelectOption {
  label: string
  value: string
}

export function Select({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  className?: string
}) {
  return (
    <div className={cn('space-y-1', className)}>
      {label ? <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</p> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-slate-700"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
