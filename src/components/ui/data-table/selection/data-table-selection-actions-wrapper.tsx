import type { ReactElement } from 'react'
import { SelectionActionsBar } from './selection-bar'
import type { DataTableSelection, DataTableProps } from '../types'

interface DataTableSelectionActionsWrapperProps<T> {
    selection?: DataTableSelection<T>
    rows: T[]
    selectedRowsCacheRef: React.MutableRefObject<Map<string, T>>
    DataTableComponent: <T = any>(props: DataTableProps<T>) => ReactElement
    /** Render inline without wrapper div (for toolbar integration) */
    inline?: boolean
}

/**
 * Selection actions bar wrapper component
 * Handles selection state, caching, and rendering of selection actions
 */
export const DataTableSelectionActionsWrapper = <T,>({
    selection,
    rows,
    selectedRowsCacheRef,
    DataTableComponent,
}: DataTableSelectionActionsWrapperProps<T>) => {
    if (
        !selection ||
        selection.selectedKeys.length === 0 ||
        selection.hideSelectionBar
    ) {
        return null
    }

    // Get selected rows with caching support
    const getSelectedRows = (keys: string[]) => {
        const cachedRows: T[] = []
        const missingKeys: string[] = []

        keys.forEach((key) => {
            const cached = selectedRowsCacheRef.current.get(key)
            if (cached) {
                cachedRows.push(cached)
            } else {
                missingKeys.push(key)
            }
        })

        if (missingKeys.length === 0) {
            return cachedRows
        }

        if (selection.getSelectedRows) {
            const result = selection.getSelectedRows(missingKeys)
            if (result instanceof Promise) {
                return result.then((fetchedRows) => [
                    ...cachedRows,
                    ...fetchedRows,
                ])
            }
            return [...cachedRows, ...result]
        }

        return cachedRows
    }

    // Clear selection and cache
    const handleClearSelection = () => {
        selectedRowsCacheRef.current.clear()
        selection.onSelectionChange([])
    }

    // Handle selection change and clean up removed items from cache
    const handleSelectionChange = (keys: string[]) => {
        const removedKeys = selection.selectedKeys.filter(
            (k) => !keys.includes(k)
        )
        removedKeys.forEach((k) => selectedRowsCacheRef.current.delete(k))
        selection.onSelectionChange(keys)
    }

    return (
        <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
                selection.selectedKeys.length > 0
                    ? 'max-h-20 opacity-100'
                    : 'max-h-0 opacity-0'
            }`}
        >
            <SelectionActionsBar
                selectedCount={selection.selectedKeys.length}
                actions={selection.actions}
                rows={rows}
                selectedKeys={selection.selectedKeys}
                getRowKey={selection.getRowKey}
                getSelectedRows={getSelectedRows}
                onClearSelection={handleClearSelection}
                onSelectionChange={handleSelectionChange}
                renderPreviewContent={selection.renderPreviewContent}
                previewColumns={selection.previewColumns}
                DataTableComponent={DataTableComponent}
            />
        </div>
    )
}
