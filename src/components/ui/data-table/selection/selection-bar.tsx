import { useState, useMemo, useCallback } from 'react'
import { Eye, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../dialog'
import type { DataTableSelectionAction, DataTableColumn } from '../types'
import { Button } from '../../button'
import { useLabels } from '../../../../lib/labels'

// Forward reference to avoid circular dependency - will be passed as prop
type DataTableCustomizedType = React.FC<any>

export interface SelectionActionsBarProps<T> {
    selectedCount: number
    actions?: DataTableSelectionAction<T>[]
    rows: T[]
    selectedKeys: string[]
    getRowKey: (row: T) => string
    getSelectedRows?: (selectedKeys: string[]) => Promise<T[]> | T[]
    onClearSelection: () => void
    onSelectionChange: (keys: string[]) => void
    /** Render function for preview dialog content */
    renderPreviewContent?: (selectedRows: T[]) => React.ReactNode
    /** Column keys to show in default preview table */
    previewColumns?: Array<{
        key: keyof T | string
        label: string
        render?: (value: any, row: T) => React.ReactNode
    }>
    /** DataTableCustomized component reference - passed to avoid circular import */
    DataTableComponent?: DataTableCustomizedType
}

export function SelectionActionsBar<T>({
    selectedCount,
    actions,
    rows,
    selectedKeys,
    getRowKey,
    getSelectedRows,
    onClearSelection,
    onSelectionChange,
    renderPreviewContent,
    previewColumns,
    DataTableComponent,
}: SelectionActionsBarProps<T>) {
    const labels = useLabels()
    const [isLoading, setIsLoading] = useState(false)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewRows, setPreviewRows] = useState<T[]>([])
    const [previewLoading, setPreviewLoading] = useState(false)
    // Track rows being faded out for animation
    const [fadingOutKeys, setFadingOutKeys] = useState<Set<string>>(new Set())
    // Client-side pagination for preview
    const [previewPage, setPreviewPage] = useState(1)
    const [previewPageSize, setPreviewPageSize] = useState(10)

    // Get selected rows from current page (fallback)
    const currentPageSelectedRows = useMemo(
        () => rows.filter((row) => selectedKeys.includes(getRowKey(row))),
        [rows, selectedKeys, getRowKey]
    )

    // Fetch full selected rows data when actions are clicked
    const handleActionClick = useCallback(
        async (action: DataTableSelectionAction<T>) => {
            let rowsData: T[]

            if (getSelectedRows) {
                setIsLoading(true)
                try {
                    const result = getSelectedRows(selectedKeys)
                    rowsData = result instanceof Promise ? await result : result
                } finally {
                    setIsLoading(false)
                }
            } else {
                // Use only current page rows
                rowsData = currentPageSelectedRows
            }

            action.onClick(rowsData)
        },
        [getSelectedRows, selectedKeys, currentPageSelectedRows]
    )

    // Handle preview button click
    const handlePreviewClick = useCallback(async () => {
        setPreviewOpen(true)
        setPreviewLoading(true)
        setPreviewPage(1) // Reset to first page

        try {
            let rowsData: T[]
            if (getSelectedRows) {
                const result = getSelectedRows(selectedKeys)
                rowsData = result instanceof Promise ? await result : result
            } else {
                rowsData = currentPageSelectedRows
            }
            setPreviewRows(rowsData)
        } finally {
            setPreviewLoading(false)
        }
    }, [getSelectedRows, selectedKeys, currentPageSelectedRows])

    const variantStyles: Record<string, string> = {
        default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        danger: 'bg-red-100 text-red-700 hover:bg-red-200',
        warning: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
        success: 'bg-green-100 text-green-700 hover:bg-green-200',
        info: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    }

    // Filter visible actions
    const visibleActions = useMemo(
        () =>
            actions?.filter(
                (action) =>
                    !action.hidden || !action.hidden(currentPageSelectedRows)
            ) || [],
        [actions, currentPageSelectedRows]
    )

    // Default preview content renderer
    const defaultPreviewContent = () => {
        if (previewLoading) {
            return (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
                </div>
            )
        }

        if (previewRows.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    {labels.noItemsSelected}
                </div>
            )
        }

        // If custom render provided, use it
        if (renderPreviewContent) {
            return renderPreviewContent(previewRows)
        }

        // If no DataTableComponent provided, show simple list
        if (!DataTableComponent) {
            return (
                <div className="space-y-2">
                    {previewRows.map((row, _index) => (
                        <div
                            key={getRowKey(row)}
                            className="p-2 border rounded text-sm"
                        >
                            {JSON.stringify(row)}
                        </div>
                    ))}
                </div>
            )
        }

        // Default: use DataTableCustomized with previewColumns
        // If previewColumns not provided, use first 4 keys
        const columnsToShow: DataTableColumn<T>[] = previewColumns
            ? previewColumns.map((col) => ({
                  key: String(col.key),
                  title: col.label,
                  render: col.render,
              }))
            : Object.keys(previewRows[0] as object)
                  .slice(0, 4)
                  .map((key) => ({
                      key,
                      title: key,
                  }))

        // Client-side pagination
        const startIndex = (previewPage - 1) * previewPageSize
        const paginatedRows = previewRows.slice(
            startIndex,
            startIndex + previewPageSize
        )

        // Handle deselection in preview with fade-out animation
        const handlePreviewSelectionChange = (newKeys: string[]) => {
            // Find which keys were removed
            const currentKeys = previewRows.map(getRowKey)
            const removedKeys = currentKeys.filter((k) => !newKeys.includes(k))

            if (removedKeys.length > 0) {
                // Add to fading out set for animation
                setFadingOutKeys((prev) => new Set([...prev, ...removedKeys]))

                // Update parent selection immediately
                const updatedSelection = selectedKeys.filter(
                    (k) => !removedKeys.includes(k)
                )
                onSelectionChange(updatedSelection)

                // Delay removal to allow fade-out animation
                setTimeout(() => {
                    setPreviewRows((prev) =>
                        prev.filter(
                            (row) => !removedKeys.includes(getRowKey(row))
                        )
                    )
                    setFadingOutKeys((prev) => {
                        const next = new Set(prev)
                        removedKeys.forEach((k) => next.delete(k))
                        return next
                    })
                }, 300)
            }
        }

        return (
            <div className="overflow-auto max-h-[60vh]">
                <DataTableComponent
                    columns={columnsToShow}
                    rows={paginatedRows}
                    rowKey={getRowKey}
                    showIndex
                    size="small"
                    emptyMessage={labels.noItemsSelected}
                    rowClassName={(row: T) =>
                        fadingOutKeys.has(getRowKey(row))
                            ? 'opacity-30 scale-[0.97] -translate-y-0.5 bg-gray-200/50 blur-[0.5px] transition-all duration-300 origin-center'
                            : 'transition-all duration-300'
                    }
                    selection={{
                        selectedKeys: previewRows
                            .map(getRowKey)
                            .filter((k) => !fadingOutKeys.has(k)),
                        onSelectionChange: handlePreviewSelectionChange,
                        getRowKey,
                        hideSelectionBar: true,
                    }}
                    pagination={{
                        page: previewPage,
                        pageSize: previewPageSize,
                        total: previewRows.length,
                        pageSizeOptions: [10, 20, 50],
                        onPageChange: setPreviewPage,
                        onPageSizeChange: (size: number) => {
                            setPreviewPageSize(size)
                            setPreviewPage(1)
                        },
                    }}
                />
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center gap-2 border-gray-200 rounded text-sm animate-slide-down origin-top">
                {/* Selected count */}
                <span className="text-sm font-medium">
                    {labels.selectedCount(selectedCount)}
                </span>
                <Button
                    variant="outline"
                    type="button"
                    onClick={handlePreviewClick}
                >
                    <Eye className="w-4 h-4" />
                    {labels.previewSelected}
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={onClearSelection}
                >
                    <X className="w-4 h-4" />
                    {labels.clearSelection}
                </Button>
                {visibleActions?.length > 0 && (
                    <div className="flex items-center gap-2">
                        {visibleActions.map((action) => {
                            const isDisabled =
                                isLoading ||
                                (action.disabled &&
                                    action.disabled(currentPageSelectedRows))

                            return (
                                <Button
                                    key={action.key}
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleActionClick(action)}
                                    disabled={isDisabled}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[action.variant || 'default']}`}
                                >
                                    {action.icon}
                                    {action.label}
                                </Button>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-4xl w-[90vw]">
                    <DialogHeader>
                        <DialogTitle>
                            {labels.selectedItemsPreview}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 overflow-x-auto">
                        {defaultPreviewContent()}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
