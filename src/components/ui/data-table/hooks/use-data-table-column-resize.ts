import { useCallback, useRef, useState } from 'react'
import type { DataTableColumn } from '../types'

/**
 * Hook for managing column resize functionality in data tables
 * Provides resize handlers and auto-fit column width capability
 */
export function useDataTableColumnResize<T>() {
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>({})
    const resizingRef = useRef<{
        columnKey: string
        startX: number
        startWidth: number
    } | null>(null)
    const justResizedRef = useRef(false)
    const tableRef = useRef<HTMLTableElement>(null)

    /**
     * Get the width for a specific column
     */
    const getColumnWidth = useCallback(
        (column: DataTableColumn<T>) => {
            const key = String(column.key)
            return columnWidths[key] ?? column.width ?? 150
        },
        [columnWidths]
    )

    /**
     * Start column resize operation
     */
    const handleResizeStart = useCallback(
        (e: React.MouseEvent, column: DataTableColumn<T>) => {
            e.preventDefault()
            e.stopPropagation()
            const key = String(column.key)
            resizingRef.current = {
                columnKey: key,
                startX: e.clientX,
                startWidth: getColumnWidth(column),
            }
            justResizedRef.current = true
        },
        [getColumnWidth]
    )

    /**
     * Handle mouse move during column resize
     */
    const handleResizeMove = useCallback((e: React.MouseEvent) => {
        if (!resizingRef.current) return
        const { columnKey, startX, startWidth } = resizingRef.current
        const diff = e.clientX - startX
        const newWidth = Math.max(50, startWidth + diff)
        setColumnWidths((prev) => ({ ...prev, [columnKey]: newWidth }))
    }, [])

    /**
     * End column resize operation
     */
    const handleResizeEnd = useCallback(() => {
        if (!resizingRef.current) return
        resizingRef.current = null
        setTimeout(() => {
            justResizedRef.current = false
        }, 200)
    }, [])

    /**
     * Auto-fit column width to content (like Excel double-click)
     */
    const handleAutoFitColumn = useCallback(
        (columnKey: string, columnIndex: number) => {
            if (!tableRef.current) return

            const allRows = tableRef.current.querySelectorAll('tr')
            let maxWidth = 50 // minimum width

            allRows.forEach((row) => {
                const cell = row.children[columnIndex] as HTMLElement
                if (cell) {
                    // Temporarily remove width constraints to measure natural width
                    const originalWidth = cell.style.width
                    const originalMinWidth = cell.style.minWidth
                    const originalMaxWidth = cell.style.maxWidth

                    cell.style.width = 'auto'
                    cell.style.minWidth = 'auto'
                    cell.style.maxWidth = 'none'

                    // Measure scrollWidth (content width)
                    const contentWidth = cell.scrollWidth + 16 // +16 for padding
                    maxWidth = Math.max(maxWidth, contentWidth)

                    // Restore original styles
                    cell.style.width = originalWidth
                    cell.style.minWidth = originalMinWidth
                    cell.style.maxWidth = originalMaxWidth
                }
            })

            // Cap at reasonable max (500px)
            maxWidth = Math.min(maxWidth, 500)
            setColumnWidths((prev) => ({ ...prev, [columnKey]: maxWidth }))

            // Prevent sort trigger
            justResizedRef.current = true
            setTimeout(() => {
                justResizedRef.current = false
            }, 200)
        },
        []
    )

    return {
        columnWidths,
        tableRef,
        justResizedRef,
        getColumnWidth,
        handleResizeStart,
        handleResizeMove,
        handleResizeEnd,
        handleAutoFitColumn,
    }
}
