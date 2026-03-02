import type { ReactNode } from 'react'
import type { DataTableColumn } from './column'

export interface DataTableExpandable<T = any> {
    /**
     * Custom render function for expanded row content
     * Can be sync or async (using Promise)
     */
    expandedRowRender?: (
        row: T,
        index: number
    ) => ReactNode | Promise<ReactNode>
    /**
     * Columns for expanded table (auto-renders DataTableCustomized)
     * Use with `expandedRowData` to specify nested data
     */
    expandedColumns?: DataTableColumn<any>[]
    /**
     * Function to extract nested data array from row
     * Required when using `expandedColumns`
     */
    expandedRowData?: (row: T) => any[]
    /**
     * Key function for expanded table rows
     * @default (_, index) => index
     */
    expandedRowKey?: (row: any, index: number) => string | number
    /**
     * Optional: Control which rows can be expanded
     */
    rowExpandable?: (row: T) => boolean
    /**
     * Optional: Controlled expanded row keys
     */
    expandedRowKeys?: string[]
    /**
     * Optional: Callback when expanded rows change
     */
    onExpandedRowsChange?: (expandedKeys: string[]) => void
    /**
     * Optional: Default expanded row keys
     */
    defaultExpandedRowKeys?: string[]
    /**
     * Optional: Custom loading component for async rendering
     */
    loadingComponent?: ReactNode
    /**
     * Optional: Custom error component for failed async rendering
     */
    errorComponent?: (error: Error) => ReactNode
}
