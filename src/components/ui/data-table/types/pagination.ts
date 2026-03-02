export interface DataTablePagination {
    /**
     * Current page number (1-indexed)
     */
    page: number
    /**
     * Number of items per page
     */
    pageSize: number
    /**
     * Total number of items
     */
    total: number
    /**
     * Callback when page changes (optional for client-side pagination)
     * If not provided, component will manage pagination state internally
     */
    onPageChange?: (page: number) => void
    /**
     * Callback when page size changes (optional for client-side pagination)
     * If not provided, component will manage pagination state internally
     */
    onPageSizeChange?: (pageSize: number) => void
    /**
     * Available page size options
     * @default [20, 50, 100]
     */
    pageSizeOptions?: number[]
}
