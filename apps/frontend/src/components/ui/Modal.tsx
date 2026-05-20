import { useEffect, type ReactNode } from 'react'

import { cn } from '../../utils/cn'
import { Button } from './Button'

export function Modal({
  open,
  title,
  children,
  onClose,
  className,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            'w-full max-w-lg rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900',
            className,
          )}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}
