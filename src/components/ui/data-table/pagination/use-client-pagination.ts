import { useMemo } from 'react'
import type { DataTablePagination } from '../types'

/**
 * Hook to handle client-side pagination
 * Slices rows based on page and pageSize when server-side callbacks not provided
 */
export const useDataTableClientPagination = <T>(
    rows: T[],
    pagination?: DataTablePagination
) => {
    // Detect client-side pagination: enabled when no callbacks provided
    const isClientSidePagination =
        pagination && !pagination.onPageChange && !pagination.onPageSizeChange

    // Slice rows for current page
    const paginatedRows = useMemo(() => {
        if (!isClientSidePagination || !pagination) {
            return rows
        }
        const startIndex = (pagination.page - 1) * pagination.pageSize
        const endIndex = startIndex + pagination.pageSize
        return rows.slice(startIndex, endIndex)
    }, [isClientSidePagination, rows, pagination?.page, pagination?.pageSize])

    // Calculate total pages
    const totalPages = pagination
        ? Math.ceil(pagination.total / pagination.pageSize)
        : 0

    // Get page size options
    const pageSizeOptions = pagination?.pageSizeOptions || [20, 50, 100]

    return {
        isClientSidePagination,
        paginatedRows,
        totalPages,
        pageSizeOptions,
    }
}
