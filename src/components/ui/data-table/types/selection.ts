import type { ReactNode } from 'react'

/**
 * Bulk action for selected rows
 */
export interface DataTableSelectionAction<T = any> {
    /**
     * Unique key for the action
     */
    key: string
    /**
     * Label to display
     */
    label: string
    /**
     * Icon to display before label
     */
    icon?: ReactNode
    /**
     * Click handler - receives array of selected rows
     */
    onClick: (selectedRows: T[]) => void
    /**
     * Optional: Disable action based on selected rows
     */
    disabled?: (selectedRows: T[]) => boolean
    /**
     * Optional: Hide action based on selected rows
     */
    hidden?: (selectedRows: T[]) => boolean
    /**
     * Optional: Variant for styling
     */
    variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
}

export interface DataTableSelection<T = any> {
    /**
     * Selected row keys
     */
    selectedKeys: string[]
    /**
     * Callback when selection changes
     */
    onSelectionChange: (selectedKeys: string[]) => void
    /**
     * Get unique key from row for selection
     */
    getRowKey: (row: T) => string
    /**
     * Optional: Determine if a row can be selected
     * Return false to disable checkbox for that row
     * @example canSelect: (row) => row.employee_status === 1
     */
    canSelect?: (row: T) => boolean
    /**
     * Optional: Reason why row cannot be selected (shown as tooltip)
     * Only shown when canSelect returns false
     */
    disabledReason?: (row: T) => string | undefined
    /**
     * Optional: Bulk actions for selected rows
     * Displayed in selection indicator bar
     */
    actions?: DataTableSelectionAction<T>[]
    /**
     * Optional: Callback to fetch full row data for selected keys
     * Used when actions need full row data (e.g., cross-page selection)
     */
    getSelectedRows?: (selectedKeys: string[]) => Promise<T[]> | T[]
    /**
     * Optional: Custom render function for preview dialog content
     */
    renderPreviewContent?: (selectedRows: T[]) => React.ReactNode
    /**
     * Optional: Columns to display in default preview table
     */
    previewColumns?: Array<{
        key: keyof T | string
        label: string
        render?: (value: any, row: T) => React.ReactNode
    }>
    /**
     * Optional: Hide the selection actions bar
     */
    hideSelectionBar?: boolean
}
