import type { ReactNode } from 'react'

/**
 * Action item for DataTable actions column
 */
export interface DataTableAction<T = any> {
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
     * Click handler
     */
    onClick: (row: T, index: number) => void
    /**
     * Optional: Hide action for specific rows
     */
    hidden?: (row: T, index: number) => boolean
    /**
     * Optional: Disable action for specific rows
     */
    disabled?: (row: T, index: number) => boolean
    /**
     * Optional: Custom className for the action item
     */
    className?: string
    /**
     * Optional: Variant for styling
     */
    variant?: 'default' | 'danger' | 'warning' | 'success' | 'info'
}
