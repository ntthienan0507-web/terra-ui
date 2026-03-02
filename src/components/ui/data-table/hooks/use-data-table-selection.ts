import { useCallback, useMemo, useRef } from 'react'
import type { DataTableSelection } from '../types'

/**
 * Hook for managing row selection in data tables
 * Supports cross-page selection and conditional row selection
 */
export function useDataTableSelection<T>(
    selection: DataTableSelection<T> | undefined,
    rows: T[]
) {
    const selectedRowsCacheRef = useRef<Map<string, T>>(new Map())

    /**
     * Check if a row can be selected
     */
    const isRowSelectable = useCallback(
        (row: T): boolean => {
            if (!selection) return false
            return selection.canSelect ? selection.canSelect(row) : true
        },
        [selection]
    )

    /**
     * Get selectable rows on current page
     */
    const selectableRows = useMemo(
        () => rows.filter((row) => isRowSelectable(row)),
        [rows, isRowSelectable]
    )

    /**
     * Handle select all checkbox
     */
    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (!selection) return

            const currentPageSelectableKeys = selectableRows.map((row) =>
                selection.getRowKey(row)
            )

            if (checked) {
                // Cache all selectable rows on current page
                selectableRows.forEach((row) => {
                    const rowKey = selection.getRowKey(row)
                    selectedRowsCacheRef.current.set(rowKey, row)
                })
                // Merge with existing selections from other pages
                const newKeys = [
                    ...new Set([
                        ...selection.selectedKeys,
                        ...currentPageSelectableKeys,
                    ]),
                ]
                selection.onSelectionChange(newKeys)
            } else {
                // Remove current page rows from cache
                currentPageSelectableKeys.forEach((key) => {
                    selectedRowsCacheRef.current.delete(key)
                })
                // Only deselect current page's selectable rows
                const newKeys = selection.selectedKeys.filter(
                    (key) => !currentPageSelectableKeys.includes(key)
                )
                selection.onSelectionChange(newKeys)
            }
        },
        [selection, selectableRows]
    )

    /**
     * Handle individual row selection
     */
    const handleSelectRow = useCallback(
        (row: T, checked: boolean) => {
            if (!selection) return
            if (!isRowSelectable(row)) return

            const rowKey = selection.getRowKey(row)
            if (checked) {
                selectedRowsCacheRef.current.set(rowKey, row)
                selection.onSelectionChange([...selection.selectedKeys, rowKey])
            } else {
                selectedRowsCacheRef.current.delete(rowKey)
                selection.onSelectionChange(
                    selection.selectedKeys.filter((key) => key !== rowKey)
                )
            }
        },
        [selection, isRowSelectable]
    )

    /**
     * Check if all selectable rows on current page are selected
     */
    const isAllSelected = selection
        ? selectableRows.length > 0 &&
          selectableRows.every((row) =>
              selection.selectedKeys.includes(selection.getRowKey(row))
          )
        : false

    /**
     * Check if some (but not all) selectable rows on current page are selected
     */
    const isSomeSelected = selection
        ? selectableRows.some((row) =>
              selection.selectedKeys.includes(selection.getRowKey(row))
          ) && !isAllSelected
        : false

    return {
        selectedRowsCacheRef,
        isRowSelectable,
        selectableRows,
        handleSelectAll,
        handleSelectRow,
        isAllSelected,
        isSomeSelected,
    }
}
