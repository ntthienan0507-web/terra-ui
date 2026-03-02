export type SortOrder = 'asc' | 'desc'

export interface DataTableSorting {
    /**
     * Current sort field (column key)
     */
    sortBy?: string
    /**
     * Sort order
     */
    sortOrder?: SortOrder
    /**
     * Callback when sorting changes
     */
    onSortChange: (sortBy: string, sortOrder: SortOrder) => void
}
