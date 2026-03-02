import { TableHead, TableRow } from '../../table'
import { GripVertical } from 'lucide-react'
import type { DataTableColumn, DataTableSorting } from '../types'
import { SortIcon } from './sort-icon'

interface DataTableHeaderRowProps<T> {
    columns: DataTableColumn<T>[]
    sorting?: DataTableSorting
    resizable?: boolean
    hiddenColumns: Set<string>
    sizeConfig: {
        fontSize: string
        customHeight?: string
        customFontSize?: string
    }
    getColumnWidth: (column: DataTableColumn<T>) => number
    getPinnedPosition: (
        column: DataTableColumn<T>
    ) => 'left' | 'right' | undefined
    getPinnedStyle: (column: DataTableColumn<T>) => React.CSSProperties
    handleSort: (columnKey: string) => void
    handleResizeStart?: (
        e: React.MouseEvent,
        column: DataTableColumn<T>
    ) => void
    handleResizeMove?: (e: React.MouseEvent) => void
    handleResizeEnd?: (e: React.MouseEvent) => void
    handleAutoFitColumn?: (columnKey: string, colIndex: number) => void
}

/**
 * Reusable header row component for DataTable
 * Used for both main header and sticky header clone
 */
export const DataTableHeaderRow = <T,>({
    columns,
    sorting,
    resizable = false,
    hiddenColumns,
    sizeConfig,
    getColumnWidth,
    getPinnedPosition,
    getPinnedStyle,
    handleSort,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
    handleAutoFitColumn,
}: DataTableHeaderRowProps<T>) => {
    return (
        <TableRow
            className="bg-gray-50 border-none"
            onMouseMove={handleResizeMove}
            onMouseUp={handleResizeEnd}
            onMouseLeave={handleResizeEnd}
        >
            {columns.map((column, colIndex) => {
                const colWidth = getColumnWidth(column)
                const isSpecialCol = ['__selection__', '__index__'].includes(
                    String(column.key)
                )
                const isSortable = column.sortable && sorting && !isSpecialCol
                const pinnedStyle = getPinnedStyle(column)
                const isPinned = Object.keys(pinnedStyle).length > 0
                const pinnedPosition = getPinnedPosition(column)
                const isPinnedRight = pinnedPosition === 'right'
                const isHiddenBySettings = hiddenColumns.has(String(column.key))

                return (
                    <TableHead
                        key={String(column.key)}
                        className={`py-1.5 px-2 ${column.headerClassName || ''} ${sizeConfig.fontSize} ${isPinnedRight ? 'bg-gray-100' : 'bg-gray-50'} text-primary whitespace-nowrap overflow-hidden capitalize text-ellipsis border-b border-gray-200 last:border-r-0 border-r relative ${isSortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''} ${isPinnedRight ? 'shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.2)]' : isPinned ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.15)]' : ''} transition-all duration-200 ease-in-out`}
                        style={{
                            width: isHiddenBySettings ? 0 : colWidth + 'px',
                            minWidth: isHiddenBySettings ? 0 : colWidth + 'px',
                            maxWidth: isHiddenBySettings ? 0 : undefined,
                            padding: isHiddenBySettings ? 0 : undefined,
                            opacity: isHiddenBySettings ? 0 : 1,
                            overflow: 'hidden',
                            ...(sizeConfig.customHeight && {
                                height: sizeConfig.customHeight,
                            }),
                            ...(sizeConfig.customFontSize && {
                                fontSize: sizeConfig.customFontSize,
                            }),
                            ...pinnedStyle,
                        }}
                        onClick={
                            isSortable && !isHiddenBySettings
                                ? () => handleSort(String(column.key))
                                : undefined
                        }
                    >
                        <span className="inline-flex items-center">
                            {column.title}
                            <SortIcon column={column} sorting={sorting} />
                        </span>
                        {resizable && !isSpecialCol && handleResizeStart && (
                            <div
                                className="absolute -right-[1px] top-0 bottom-0 w-2 cursor-col-resize flex items-center justify-end group z-10"
                                onMouseDown={(e) => {
                                    e.stopPropagation()
                                    handleResizeStart(e, column)
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => {
                                    e.stopPropagation()
                                    handleAutoFitColumn?.(
                                        String(column.key),
                                        colIndex
                                    )
                                }}
                            >
                                <GripVertical
                                    size={10}
                                    className="text-gray-400 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity mr-[-3px]"
                                />
                            </div>
                        )}
                    </TableHead>
                )
            })}
        </TableRow>
    )
}
