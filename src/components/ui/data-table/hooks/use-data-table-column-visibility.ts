import { useCallback } from 'react'

/**
 * Hook for managing column visibility in data tables
 */
export function useDataTableColumnVisibility(
    hiddenColumns: Set<string>,
    setHiddenColumns: (columns: Set<string>) => void
) {
    /**
     * Toggle visibility of a column
     */
    const toggleColumn = useCallback(
        (columnKey: string) => {
            const newSet = new Set(hiddenColumns)
            if (newSet.has(columnKey)) {
                newSet.delete(columnKey)
            } else {
                newSet.add(columnKey)
            }
            setHiddenColumns(newSet)
        },
        [hiddenColumns, setHiddenColumns]
    )

    /**
     * Reset all columns to visible
     */
    const resetColumns = useCallback(() => {
        setHiddenColumns(new Set())
    }, [setHiddenColumns])

    return {
        toggleColumn,
        resetColumns,
    }
}
