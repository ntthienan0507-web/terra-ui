import { createContext, useContext } from 'react'

export interface DataTableLabels {
    // Selection
    noItemsSelected: string
    selectedCount: (count: number) => string
    previewSelected: string
    clearSelection: string
    selectedItemsPreview: string
    // Pagination
    pageInfo: (page: number, totalPages: number, total: string) => string
    records: string
    goToPage: string
    firstPage: string
    previousPage: string
    nextPage: string
    lastPage: string
    // Settings
    settingsTitle: string
    tableSettings: string
    fontSize: string
    rowHeight: string
    actions: string
    // Column visibility
    columnVisibility: string
    showAll: string
    pinToToolbar: string
    unpinFromToolbar: string
    displayOptions: string
    selectAll: string
    deselectAll: string
    columns: string
    // Filters
    filterVisibility: string
    filterSettings: string
    // Font/Row size labels
    small: string
    medium: string
    large: string
    // Empty/Loading
    noData: string
    loading: string
    error: string
    // Search
    searchPlaceholder: string
    // Index column
    indexColumnTitle: string
    // Boolean formatter
    trueLabel: string
    falseLabel: string
}

export const defaultLabels: DataTableLabels = {
    noItemsSelected: 'No items selected',
    selectedCount: (count) => `${count} items selected`,
    previewSelected: 'View list',
    clearSelection: 'Clear',
    selectedItemsPreview: 'Selected items',
    pageInfo: (page, totalPages, total) =>
        `Page ${page} / ${totalPages} (${total} records)`,
    records: 'Records',
    goToPage: 'Go to page',
    firstPage: 'First page',
    previousPage: 'Previous page',
    nextPage: 'Next page',
    lastPage: 'Last page',
    settingsTitle: 'Settings',
    tableSettings: 'Table settings',
    fontSize: 'Font size',
    rowHeight: 'Row height',
    actions: 'Actions',
    columnVisibility: 'Show/Hide columns',
    showAll: 'Show all',
    pinToToolbar: 'Pin to toolbar',
    unpinFromToolbar: 'Unpin',
    displayOptions: 'Display options',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
    columns: 'Columns',
    filterVisibility: 'Show/Hide filters',
    filterSettings: 'Filter settings',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    noData: 'No data',
    loading: 'Loading...',
    error: 'Error',
    searchPlaceholder: 'Search...',
    indexColumnTitle: '#',
    trueLabel: 'Yes',
    falseLabel: 'No',
}

const DataTableLabelsContext = createContext<DataTableLabels>(defaultLabels)

export const DataTableLabelsProvider = DataTableLabelsContext.Provider

export function useLabels(): DataTableLabels {
    return useContext(DataTableLabelsContext)
}
