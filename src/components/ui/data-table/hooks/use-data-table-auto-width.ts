import { useEffect, useRef } from 'react'
import type { DataTableColumn } from '../types'

/**
 * Hook to handle auto-width calculation for table columns
 * Calculates optimal width by measuring content in all rows
 */
export const useDataTableAutoWidth = <T>(
    autoWidth: boolean,
    rows: T[],
    finalColumns: DataTableColumn<T>[],
    tableRef: React.RefObject<HTMLTableElement>,
    getColumnWidth: (column: DataTableColumn<T>) => number
) => {
    const autoWidthAppliedRef = useRef(false)

    useEffect(() => {
        if (!autoWidth || !tableRef.current || autoWidthAppliedRef.current)
            return
        if (rows.length === 0) return

        const timer = setTimeout(() => {
            const allRows = tableRef.current?.querySelectorAll('tr')
            if (!allRows) return

            const newWidths: Record<string, number> = {}

            finalColumns.forEach((col, colIndex) => {
                // Skip special columns (selection, index, actions)
                const isSpecialCol = [
                    '__selection__',
                    '__index__',
                    'actions',
                ].includes(String(col.key))
                if (isSpecialCol) return

                let maxWidth = 50

                // Measure content width in all rows
                allRows.forEach((row) => {
                    const cell = row.children[colIndex] as HTMLElement
                    if (cell) {
                        // Store original styles
                        const originalWidth = cell.style.width
                        const originalMinWidth = cell.style.minWidth
                        const originalMaxWidth = cell.style.maxWidth

                        // Temporarily remove width constraints to measure content
                        cell.style.width = 'auto'
                        cell.style.minWidth = 'auto'
                        cell.style.maxWidth = 'none'

                        const contentWidth = cell.scrollWidth + 16
                        maxWidth = Math.max(maxWidth, contentWidth)

                        // Restore original styles
                        cell.style.width = originalWidth
                        cell.style.minWidth = originalMinWidth
                        cell.style.maxWidth = originalMaxWidth
                    }
                })

                // Apply min/max constraints (50px - 500px)
                maxWidth = Math.max(50, Math.min(maxWidth, 500))
                newWidths[String(col.key)] = maxWidth
            })

            getColumnWidth // Trigger setState internally
            autoWidthAppliedRef.current = true
        }, 100)

        return () => clearTimeout(timer)
    }, [autoWidth, rows.length, finalColumns, tableRef, getColumnWidth])

    return { autoWidthAppliedRef }
}
