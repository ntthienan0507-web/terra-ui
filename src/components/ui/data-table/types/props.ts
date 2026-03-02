import type { ReactNode } from 'react'
import type { DataTableLabels } from '../../../../lib/labels'
import type { DataTableAction } from './actions'
import type { DataTableColumn } from './column'
import type { DataTableExpandable } from './expandable'
import type { DataTableFooterRow } from './footer'
import type { DataTablePagination } from './pagination'
import type { DataTableSelection } from './selection'
import type { DataTableSorting } from './sorting'
import type { DataTableToolbarConfig } from './toolbar'

export interface DataTableProps<T = any> {
    /**
     * Column definitions
     */
    columns: DataTableColumn<T>[]
    /**
     * Row data
     */
    rows: T[]
    /**
     * Optional pagination configuration
     */
    pagination?: DataTablePagination
    /**
     * Optional selection configuration
     * When provided, adds a checkbox column automatically
     */
    selection?: DataTableSelection<T>
    /**
     * Optional sorting configuration
     */
    sorting?: DataTableSorting
    /**
     * Show index column with auto-numbering
     * @default false
     */
    showIndex?: boolean
    /**
     * Optional footer row configuration
     */
    footerRow?: DataTableFooterRow<T>
    /**
     * Optional max height for scrollable table body
     */
    maxHeight?: string
    /**
     * Pin header and footer when scrolling (requires maxHeight)
     * @default false
     */
    pinnedHeader?: boolean
    /**
     * Optional expandable row configuration
     */
    expandable?: DataTableExpandable<T>
    /**
     * Initial loading state (no data yet)
     */
    loading?: boolean
    /**
     * Fetching/refreshing state (data exists, fetching new data)
     * @default false
     */
    isFetching?: boolean
    /**
     * Optional empty message
     */
    emptyMessage?: string
    /**
     * Optional loading message
     */
    loadingMessage?: string
    /**
     * Optional className for the table wrapper
     */
    className?: string
    /**
     * Optional className for the table
     */
    tableClassName?: string
    /**
     * Optional row key extractor
     */
    rowKey?: (row: T, index: number) => string | number
    /**
     * Optional row click handler
     */
    onRowClick?: (row: T, index: number) => void
    /**
     * Optional row className
     */
    rowClassName?: string | ((row: T, index: number) => string)
    /**
     * Table size variant
     * @default "small"
     */
    size?: 'small' | 'medium' | 'custom'
    /**
     * Custom row height (used when size="custom")
     */
    customRowHeight?: string
    /**
     * Custom font size (used when size="custom")
     */
    customFontSize?: string
    /**
     * Show cell borders (left/right)
     * @default false
     */
    bordered?: boolean
    /**
     * Enable column resizing
     * @default false
     */
    resizable?: boolean
    /**
     * Auto-fit column widths based on content
     * @default false
     */
    autoWidth?: boolean
    /**
     * Actions column configuration
     */
    actions?: DataTableAction<T>[]
    /**
     * Optional toolbar configuration
     */
    toolbar?: DataTableToolbarConfig<T>
    /**
     * Custom header to replace the default single-row header.
     * Use for grouped/multi-level headers. Receives a `<thead>` element.
     */
    customHeader?: ReactNode
    /**
     * Sticky header configuration
     */
    stickyHeader?: {
        /**
         * Enable sticky header behavior
         * @default true
         */
        enabled?: boolean
        /**
         * Offset from top (e.g., navbar height)
         * @default 0
         */
        offsetTop?: number
        /**
         * CSS selector to query element for offset height
         */
        offsetTopSelector?: string
        /**
         * Z-index for sticky header
         * @default 40
         */
        zIndex?: number
    }
    /**
     * Override default labels for i18n support
     */
    labels?: Partial<DataTableLabels>
}
