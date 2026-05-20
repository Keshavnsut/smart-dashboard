export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalRecords: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<TData> {
  success: boolean
  message: string
  data?: TData
  pagination?: PaginationMeta
  details?: unknown
}
