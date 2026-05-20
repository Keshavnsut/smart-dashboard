import { Button } from './Button'
import type { PaginationMeta } from '../../types/api'

export function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta
  onPageChange: (page: number) => void
}) {
  const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={!hasPrevPage}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
