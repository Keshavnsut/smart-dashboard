import { forwardRef, type ButtonHTMLAttributes } from 'react'

import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const styles: Record<ButtonVariant, string> = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200',
  secondary:
    'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-200/60 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  danger:
    'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:bg-red-600 dark:hover:bg-red-500',
  ghost:
    'bg-transparent text-slate-900 hover:bg-slate-200 disabled:text-slate-400 dark:text-slate-100 dark:hover:bg-slate-800',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-slate-600',
        styles[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
})
