import { useState } from 'react'
import type { DataTableProps } from '../types'

/**
 * Hook for managing expandable rows in data tables
 */
export function useDataTableExpandable<T>(
    expandable: DataTableProps<T>['expandable']
) {
    const [internalExpandedKeys, setInternalExpandedKeys] = useState<string[]>(
        expandable?.defaultExpandedRowKeys || []
    )

    const expandedKeys = expandable?.expandedRowKeys ?? internalExpandedKeys

    /**
     * Toggle expand state for a row
     */
    const handleToggleExpand = (rowKey: string) => {
        const newExpandedKeys = expandedKeys.includes(rowKey)
            ? expandedKeys.filter((key) => key !== rowKey)
            : [...expandedKeys, rowKey]

        if (expandable?.onExpandedRowsChange) {
            expandable.onExpandedRowsChange(newExpandedKeys)
        } else {
            setInternalExpandedKeys(newExpandedKeys)
        }
    }

    return {
        expandedKeys,
        handleToggleExpand,
    }
}
