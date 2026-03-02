import type { DataTableColumn, DataTableKey } from '../types'

/**
 * Get row key from row data and index
 */
export function getRowKey<T>(
    row: T,
    index: number,
    rowKey?: (row: T, index: number) => string | number
): string {
    if (rowKey) {
        return String(rowKey(row, index))
    }
    if (row && typeof row === 'object') {
        const obj = row as any
        if (obj.id) return String(obj.id)
        if (obj._id) return String(obj._id)
        if (obj.key) return String(obj.key)
    }
    return String(index)
}

/**
 * Get CSS class name for a row
 */
export function getRowClassName<T>(
    row: T,
    index: number,
    rowClassName?: string | ((row: T, index: number) => string),
    onRowClick?: (row: T, index: number) => void
): string {
    let baseClassName = onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''

    if (typeof rowClassName === 'function') {
        baseClassName += ' ' + rowClassName(row, index)
    } else if (rowClassName) {
        baseClassName += ' ' + rowClassName
    }

    return baseClassName.trim()
}

/**
 * Get cell value from row data using column key
 */
export function getCellValue<T>(row: T, columnKey: DataTableKey<T>): any {
    if (row && typeof row === 'object') {
        return (row as any)[columnKey]
    }
    return undefined
}

/**
 * Get pinned position for a column (left, right, or undefined)
 */
export function getPinnedPosition<T>(
    column: DataTableColumn<T>
): 'left' | 'right' | undefined {
    if (column.pinned) return column.pinned
    // Default actions column to pinned right
    if (String(column.key) === 'actions') return 'right'
    return undefined
}

/**
 * Calculate pinned column positions (left and right offsets)
 */
export function calculatePinnedPositions<T>(
    columns: DataTableColumn<T>[],
    getColumnWidth: (column: DataTableColumn<T>) => number
): Record<string, { left?: number; right?: number }> {
    const positions: Record<string, { left?: number; right?: number }> = {}

    // Calculate left positions (cumulative from left)
    let leftOffset = 0
    for (const col of columns) {
        const pinned = getPinnedPosition(col)
        if (pinned === 'left') {
            positions[String(col.key)] = { left: leftOffset }
            leftOffset += getColumnWidth(col)
        }
    }

    // Calculate right positions (cumulative from right, reversed)
    let rightOffset = 0
    for (let i = columns.length - 1; i >= 0; i--) {
        const col = columns[i]
        const pinned = getPinnedPosition(col)
        if (pinned === 'right') {
            positions[String(col.key)] = { right: rightOffset }
            rightOffset += getColumnWidth(col)
        }
    }

    return positions
}

/**
 * Get sticky style for a pinned column
 */
export function getPinnedStyle<T>(
    column: DataTableColumn<T>,
    pinnedPositions: Record<string, { left?: number; right?: number }>
): React.CSSProperties {
    const pinned = getPinnedPosition(column)
    if (!pinned) return {}

    const pos = pinnedPositions[String(column.key)]
    if (!pos) return {}

    return {
        position: 'sticky',
        ...(pos.left !== undefined && { left: pos.left }),
        ...(pos.right !== undefined && { right: pos.right }),
        zIndex: 10,
    }
}

/**
 * Calculate total table width from column widths
 */
export function calculateTableWidth<T>(
    columns: DataTableColumn<T>[],
    getColumnWidth: (column: DataTableColumn<T>) => number
): number {
    return columns.reduce((sum, col) => sum + getColumnWidth(col), 0)
}
