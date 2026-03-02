import { Checkbox } from '../../checkbox'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../tooltip'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../dropdown-menu'
import { Button } from '../../button'
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react'
import type {
    DataTableAction,
    DataTableColumn,
    DataTablePagination,
    DataTableProps,
    DataTableSelection,
} from '../types'
import { getRowKey } from './data-table-utils'
import { renderFormatter } from '../data-table-formatters'
import type { DataTableLabels } from '../../../../lib/labels'

interface BuildColumnsParams<T> {
    columns: DataTableColumn<T>[]
    rows: T[]
    selection?: DataTableSelection<T>
    showIndex?: boolean
    pagination?: DataTablePagination
    expandable?: DataTableProps<T>['expandable']
    expandedKeys: string[]
    actions?: DataTableAction<T>[]
    isAllSelected: boolean
    isSomeSelected: boolean
    selectableRows: T[]
    handleSelectAll: (checked: boolean) => void
    handleSelectRow: (row: T, checked: boolean) => void
    handleToggleExpand: (key: string) => void
    isRowSelectable: (row: T) => boolean
    rowKey?: (row: T, index: number) => string | number
    labels: Pick<DataTableLabels, 'indexColumnTitle'>
}

/**
 * Get variant-specific color classes for action items
 */
function getVariantClasses(variant?: string): string {
    switch (variant) {
        case 'danger':
            return 'text-red-600 focus:text-red-600 focus:bg-red-50'
        case 'warning':
            return 'text-orange-600 focus:text-orange-600 focus:bg-orange-50'
        case 'success':
            return 'text-green-600 focus:text-green-600 focus:bg-green-50'
        case 'info':
            return 'text-blue-600 focus:text-blue-600 focus:bg-blue-50'
        default:
            return 'text-gray-700 focus:text-gray-900'
    }
}

/**
 * Build final columns array with selection, index, expand, and actions columns
 */
export function buildDataTableColumns<T>({
    columns,
    rows,
    selection,
    showIndex,
    pagination,
    expandable,
    expandedKeys,
    actions,
    isAllSelected,
    isSomeSelected,
    selectableRows,
    handleSelectAll,
    handleSelectRow,
    handleToggleExpand,
    isRowSelectable,
    rowKey,
    labels,
}: BuildColumnsParams<T>): DataTableColumn<T>[] {
    const builtColumns: DataTableColumn<T>[] = []

    // Add selection column first if needed
    if (selection) {
        builtColumns.push({
            key: '__selection__',
            pinned: 'left',
            title: (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={isAllSelected}
                        indeterminate={isSomeSelected}
                        disabled={selectableRows.length === 0}
                        onCheckedChange={handleSelectAll}
                    />
                </div>
            ),
            width: 50,
            headerClassName:
                '!text-center !px-0 !w-[50px] animate-slide-in-left',
            cellClassName: '!text-center !px-0 !w-[50px] animate-slide-in-left',
            render: (_, row) => {
                const canSelect = isRowSelectable(row)
                const disabledReason =
                    !canSelect && selection.disabledReason
                        ? selection.disabledReason(row)
                        : undefined

                const checkbox = (
                    <Checkbox
                        checked={selection.selectedKeys.includes(
                            selection.getRowKey(row)
                        )}
                        disabled={!canSelect}
                        onCheckedChange={(checked) =>
                            handleSelectRow(row, checked as boolean)
                        }
                    />
                )

                return (
                    <div
                        className="flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {disabledReason ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="cursor-not-allowed">
                                        {checkbox}
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {disabledReason}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            checkbox
                        )}
                    </div>
                )
            },
        })
    }

    // Add index column if needed
    if (showIndex) {
        const startIndex = pagination
            ? (pagination.page - 1) * pagination.pageSize
            : 0

        builtColumns.push({
            key: '__index__',
            title: labels.indexColumnTitle,
            width: 60,
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (_, __, index) => startIndex + index + 1,
        })
    }

    // Filter visible columns
    const visibleColumns = columns.filter((col) => {
        if (col.hidden === undefined) return true
        if (typeof col.hidden === 'boolean') return !col.hidden
        if (typeof col.hidden === 'function') return !col.hidden(col, rows)
        return true
    })

    // If expandable, inject expand icon into first column
    if (expandable && visibleColumns.length > 0) {
        const firstCol = visibleColumns[0]
        const originalRender = firstCol.render
        visibleColumns[0] = {
            ...firstCol,
            render: (value, row, index) => {
                const key = getRowKey(row, index, rowKey)
                const isExpanded = expandedKeys.includes(key)
                const canExpand = expandable.rowExpandable
                    ? expandable.rowExpandable(row)
                    : true

                const expandButton = canExpand ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleToggleExpand(key)
                        }}
                        className="inline-flex items-center justify-center w-4 h-4 hover:bg-gray-100 rounded transition-colors mr-1"
                    >
                        {isExpanded ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                    </button>
                ) : (
                    <span className="w-4 h-4 mr-1 inline-block" />
                )

                // Render content: prefer render, then formatter, finally raw value
                const content = originalRender
                    ? originalRender(value, row, index)
                    : firstCol.formatter
                      ? renderFormatter(value, row, firstCol.formatter)
                      : value

                return (
                    <div className="flex items-center gap-1">
                        {expandButton}
                        {content}
                    </div>
                )
            },
        }
    }

    builtColumns.push(...visibleColumns)

    // Add actions column if actions prop is provided
    if (actions && actions.length > 0) {
        builtColumns.push({
            key: 'actions',
            title: '',
            width: 50,
            headerClassName: 'text-center',
            cellClassName: 'text-center',
            render: (_, row, index) => {
                const visibleActions = actions.filter(
                    (action) => !action.hidden || !action.hidden(row, index)
                )
                if (visibleActions.length === 0) return null

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 min-w-7 p-0 hover:bg-gray-100"
                            >
                                <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="min-w-[160px]"
                        >
                            {visibleActions.map((action) => {
                                const isDisabled = action.disabled?.(row, index)
                                const variantClasses = getVariantClasses(
                                    action.variant
                                )
                                return (
                                    <DropdownMenuItem
                                        key={action.key}
                                        onClick={() =>
                                            action.onClick(row, index)
                                        }
                                        disabled={isDisabled}
                                        className={`cursor-pointer ${variantClasses} ${action.className || ''}`}
                                    >
                                        {action.icon && (
                                            <span className="mr-2 flex-shrink-0">
                                                {action.icon}
                                            </span>
                                        )}
                                        {action.label}
                                    </DropdownMenuItem>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        })
    }

    return builtColumns
}
