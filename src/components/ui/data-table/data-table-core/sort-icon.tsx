import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import type { DataTableColumn, DataTableSorting } from '../types'

interface SortIconProps<T> {
    column: DataTableColumn<T>
    sorting?: DataTableSorting
}

/**
 * Render sort icon for column header
 */
export function SortIcon<T>({ column, sorting }: SortIconProps<T>) {
    if (!column.sortable || !sorting) return null

    const columnKey = String(column.key)
    const isActive = sorting.sortBy === columnKey

    if (isActive) {
        return sorting.sortOrder === 'asc' ? (
            <ArrowUp className="w-4 h-4 ml-1 inline-block text-blue-600" />
        ) : (
            <ArrowDown className="w-4 h-4 ml-1 inline-block text-blue-600" />
        )
    }

    return <ArrowUpDown className="w-3 h-3 ml-1 inline-block text-gray-300" />
}
