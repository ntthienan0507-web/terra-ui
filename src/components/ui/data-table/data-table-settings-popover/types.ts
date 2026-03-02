import type { ReactNode } from 'react'
import type { DataTableColumn, FilterToggle } from '../types'

export interface SettingsPopoverProps<T = any> {
    showFontSize?: boolean
    fontSizeOptions?: { label: string; value: string }[]
    fontSize?: string
    onFontSizeChange?: (fontSize: string) => void
    showRowHeight?: boolean
    rowHeightOptions?: { label: string; value: string }[]
    rowHeight?: string
    onRowHeightChange?: (rowHeight: string) => void
    showColumnVisibility?: boolean
    columns?: DataTableColumn<T>[]
    hiddenColumns?: Set<string>
    onToggleColumn?: (columnKey: string) => void
    onResetColumns?: () => void
    /** Whether columns visibility is pinned to toolbar */
    columnsPinned?: boolean
    /** Callback when pin state changes */
    onColumnsPinnedChange?: (pinned: boolean) => void
    /** @deprecated Use actionComponents instead for better UX */
    slotComponents?: ReactNode[]
    /** Action components (export, etc.) - renders with "Actions" header */
    actionComponents?: ReactNode[]
    /** Custom filter toggle switches */
    filterToggles?: FilterToggle[]
    /** Toggle values for uncontrolled toggles */
    toggleValues?: Record<string, boolean>
    /** Callback when toggle changes (for uncontrolled toggles) */
    onToggleChange?: (key: string, value: boolean) => void
    /** Hidden options for 'options' type toggles - key is toggle key, value is array of hidden option values */
    hiddenOptions?: Record<string, string[]>
    /** Callback when hidden options change */
    onHiddenOptionsChange?: (key: string, hiddenValues: string[]) => void
    /** Tour data-tour attribute */
    tourId?: string
}

export const DEFAULT_FONT_SIZE_OPTIONS = [
    { label: 'Small', value: 'text-xs' },
    { label: 'Medium', value: 'text-sm' },
    { label: 'Large', value: 'text-base' },
]

export const DEFAULT_ROW_HEIGHT_OPTIONS = [
    { label: 'Small', value: 'h-8' },
    { label: 'Medium', value: 'h-10' },
    { label: 'Large', value: 'h-12' },
]

// Special column keys that cannot be hidden
export const SPECIAL_COLUMN_KEYS = ['__selection__', '__index__', 'actions']
