import { forwardRef, type InputHTMLAttributes } from 'react'

import { cn } from '../../utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, label, id, ...props },
  ref,
) {
  const inputId = id ?? props.name

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        className={cn(
          'h-10 w-full rounded-md border bg-white px-3 text-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2 focus:ring-slate-300 dark:bg-slate-900 dark:placeholder:text-slate-500 dark:focus:ring-slate-700',
          error
            ? 'border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-900/30'
            : 'border-slate-300 dark:border-slate-700',
          className,
        )}
        {...props}
      />

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}
    </div>
  )
})
