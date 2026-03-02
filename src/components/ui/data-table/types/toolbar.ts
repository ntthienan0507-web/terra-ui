import type { ReactNode } from 'react'
import type { DataTableColumn } from './column'

// Filter Toggle types
export interface FilterToggleOption {
    label: string
    value: string
}

export interface FilterToggle {
    key: string
    label: string
    /** Group/category name shown as prefix in badge */
    group?: string
    /** Toggle type: 'visibility' for show/hide filters, 'setting' for boolean config, 'options' for multi-select */
    type?: 'visibility' | 'setting' | 'options'
    /** For boolean toggles (visibility/setting) */
    defaultValue?: boolean
    value?: boolean
    onChange?: (value: boolean) => void
    /** For 'options' type - list of options that can be shown/hidden */
    options?: FilterToggleOption[]
    /** For 'options' type - default hidden option values */
    defaultHiddenOptions?: string[]
    /** For 'options' type - single select mode */
    singleSelect?: boolean
    /** For 'options' type with singleSelect - default selected option value */
    defaultSelectedOption?: string
}

export interface DataTableToolbarConfig<T = any> {
    /**
     * Search input configuration
     */
    search?: {
        value: string
        onChange: (value: string) => void
        placeholder?: string
        className?: string
        tourId?: string
    }
    /**
     * Show column visibility dropdown
     * @default false
     */
    visibilityColumn?: boolean
    /**
     * Column visibility dropdown props
     */
    visibilityColumnProps?: {
        compact?: boolean
        showChevron?: boolean
        buttonLabel?: string
    }
    /**
     * Custom slot components to render in toolbar left side
     */
    slotComponents?: ReactNode[]
    /**
     * Optional className for the toolbar
     */
    className?: string
    /**
     * Filter function to determine which columns can be toggled
     */
    canToggleColumn?: (column: DataTableColumn<T>) => boolean
    /**
     * Controlled hidden columns
     */
    hiddenColumns?: Set<string>
    /**
     * Callback when hidden columns change
     */
    onHiddenColumnsChange?: (hiddenColumns: Set<string>) => void
    /**
     * Settings panel configuration
     */
    settings?: DataTableSettingsConfig
}

export interface DataTableSettingsConfig {
    /**
     * Show settings icon/popover
     * @default false
     */
    show?: boolean
    /**
     * Show font size selector
     * @default true
     */
    showFontSize?: boolean
    /**
     * Font size options
     */
    fontSizeOptions?: { label: string; value: string }[]
    /**
     * Current font size value (controlled)
     */
    fontSize?: string
    /**
     * Callback when font size changes
     */
    onFontSizeChange?: (fontSize: string) => void
    /**
     * Show row height selector
     * @default true
     */
    showRowHeight?: boolean
    /**
     * Row height options
     */
    rowHeightOptions?: { label: string; value: string }[]
    /**
     * Current row height value (controlled)
     */
    rowHeight?: string
    /**
     * Callback when row height changes
     */
    onRowHeightChange?: (rowHeight: string) => void
    /**
     * localStorage key for persisting settings
     */
    storageKey?: string
    /**
     * Show column visibility controls in settings
     * @default true
     */
    showColumnVisibility?: boolean
    /**
     * @deprecated Use actionComponents instead
     */
    slotComponents?: ReactNode[]
    /**
     * Action components (export, etc.)
     */
    actionComponents?: ReactNode[]
    /**
     * Custom filter toggle switches
     */
    filterToggles?: Array<{
        key: string
        label: string
        group?: string
        type?: 'visibility' | 'setting' | 'options'
        defaultValue?: boolean
        value?: boolean
        onChange?: (value: boolean) => void
        options?: Array<{ label: string; value: string }>
        defaultHiddenOptions?: string[]
        singleSelect?: boolean
        defaultSelectedOption?: string
    }>
    /** Tour data-tour attribute */
    tourId?: string
}
