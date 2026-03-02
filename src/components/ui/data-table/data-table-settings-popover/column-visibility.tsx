import { Eye, EyeOff, Pin, PinOff } from 'lucide-react'
import { useLabels } from '../../../../lib/labels'
import type { DataTableColumn } from '../types'

interface ColumnVisibilityProps<T = any> {
    columns: DataTableColumn<T>[]
    hiddenColumns: Set<string>
    onToggleColumn?: (columnKey: string) => void
    onResetColumns?: () => void
    columnsPinned?: boolean
    onColumnsPinnedChange?: (pinned: boolean) => void
}

export function ColumnVisibility<T>({
    columns,
    hiddenColumns,
    onToggleColumn,
    onResetColumns,
    columnsPinned = false,
    onColumnsPinnedChange,
}: ColumnVisibilityProps<T>) {
    const labels = useLabels()

    if (columns.length === 0) return null

    return (
        <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative border border-gray-200 rounded-lg pt-4 pb-3 px-3">
                <div className="absolute -top-2.5 left-3 px-2 bg-white flex items-center gap-1.5 text-xs font-medium text-gray-600">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{labels.columnVisibility}</span>
                    <span className="text-gray-400 text-[10px]">
                        ({columns.length - hiddenColumns.size}/{columns.length})
                    </span>
                </div>
                <div className="absolute -top-2.5 right-3 px-1 bg-white flex items-center gap-1">
                    {onColumnsPinnedChange && (
                        <button
                            type="button"
                            onClick={() =>
                                onColumnsPinnedChange(!columnsPinned)
                            }
                            className={`p-1 rounded transition-colors ${
                                columnsPinned
                                    ? 'text-blue-600 bg-blue-100 hover:bg-blue-200'
                                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                            }`}
                            title={
                                columnsPinned
                                    ? labels.unpinFromToolbar
                                    : labels.pinToToolbar
                            }
                        >
                            {columnsPinned ? (
                                <PinOff className="h-3.5 w-3.5" />
                            ) : (
                                <Pin className="h-3.5 w-3.5" />
                            )}
                        </button>
                    )}
                    {hiddenColumns.size > 0 && onResetColumns && (
                        <button
                            type="button"
                            onClick={onResetColumns}
                            className="text-[10px] px-1.5 py-0.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        >
                            {labels.showAll}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-1">
                    {columns.map((column) => {
                        const key = String(column.key)
                        const isHidden = hiddenColumns.has(key)
                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onToggleColumn?.(key)}
                                className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors ${
                                    isHidden
                                        ? 'text-gray-400 hover:bg-gray-100'
                                        : 'text-gray-700 bg-blue-50/50 hover:bg-blue-100/50'
                                }`}
                            >
                                {isHidden ? (
                                    <EyeOff className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                                ) : (
                                    <Eye className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                )}
                                <span className="truncate text-left">
                                    {column.title}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
