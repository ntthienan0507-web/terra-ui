import { Fragment, type ReactElement } from 'react'
import { TableBody, TableCell, TableRow } from '../../table'
import { cn } from '../../../../lib/utils'
import type {
    DataTableColumn,
    DataTableKey,
    DataTableExpandable,
    DataTableProps,
} from '../types'
import { renderFormatter } from '../data-table-formatters'
import { ExpandedRowContent } from './expanded-row'

interface DataTableBodyRowsProps<T> {
    rows: T[]
    columns: DataTableColumn<T>[]
    loading: boolean
    emptyMessage: string
    loadingMessage: string
    bordered: boolean
    selection?: { selectedKeys: string[] }
    expandable?: DataTableExpandable<T>
    expandedKeys: string[]
    sizeConfig: {
        fontSize: string
        heightClass: string
        customHeight?: string
        customFontSize?: string
    }
    hiddenColumns: Set<string>
    getRowKey: (row: T, index: number) => string
    getRowClassName: (row: T, index: number) => string
    getCellValue: (row: T, columnKey: DataTableKey<T>) => any
    getColumnWidth: (column: DataTableColumn<T>) => number
    getPinnedPosition: (
        column: DataTableColumn<T>
    ) => 'left' | 'right' | undefined
    getPinnedStyle: (column: DataTableColumn<T>) => React.CSSProperties
    onRowClick?: (row: T, index: number) => void
    /** DataTable component reference - passed to avoid circular import */
    DataTableComponent?: <U = any>(props: DataTableProps<U>) => ReactElement
}

/**
 * Body rows component for DataTable
 * Handles rendering of table body with rows, cells, and expanded content
 */
export const DataTableBodyRows = <T,>({
    rows,
    columns,
    loading,
    emptyMessage,
    loadingMessage,
    bordered,
    selection,
    expandable,
    expandedKeys,
    sizeConfig,
    hiddenColumns,
    getRowKey,
    getRowClassName,
    getCellValue,
    getColumnWidth,
    getPinnedPosition,
    getPinnedStyle,
    onRowClick,
    DataTableComponent,
}: DataTableBodyRowsProps<T>) => {
    if (loading && rows.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="text-center py-8 text-muted-foreground"
                    >
                        {loadingMessage}
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    if (rows.length === 0) {
        return (
            <TableBody>
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="text-center py-8 text-muted-foreground"
                    >
                        {emptyMessage}
                    </TableCell>
                </TableRow>
            </TableBody>
        )
    }

    return (
        <TableBody>
            {rows.map((row, rowIndex) => {
                const key = getRowKey(row, rowIndex)
                const isExpanded = expandable && expandedKeys.includes(key)

                return (
                    <Fragment key={key}>
                        <TableRow
                            className={`${getRowClassName(row, rowIndex)} ${sizeConfig.heightClass} ${sizeConfig.fontSize}`}
                            style={{
                                ...(sizeConfig.customHeight && {
                                    height: sizeConfig.customHeight,
                                }),
                                ...(sizeConfig.customFontSize && {
                                    fontSize: sizeConfig.customFontSize,
                                }),
                            }}
                            onClick={() => onRowClick?.(row, rowIndex)}
                        >
                            {columns.map((column) => {
                                const rawValue = getCellValue(row, column.key)
                                const value = column.valueGetter
                                    ? column.valueGetter(row, rowIndex)
                                    : rawValue
                                const colWidth = getColumnWidth(column)
                                const pinnedStyle = getPinnedStyle(column)
                                const isPinned =
                                    Object.keys(pinnedStyle).length > 0
                                const pinnedPosition = getPinnedPosition(column)
                                const isPinnedRight = pinnedPosition === 'right'
                                const isHiddenBySettings = hiddenColumns.has(
                                    String(column.key)
                                )

                                return (
                                    <TableCell
                                        key={String(column.key)}
                                        className={`${column.cellClassName || ''} ${bordered ? 'border-x border-gray-200' : ''} ${isPinnedRight ? 'bg-gray-50/80 hover:bg-gray-100/80' : isPinned ? 'bg-white' : ''} ${isPinnedRight ? 'shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.2)]' : isPinned ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''} transition-all duration-200 ease-in-out`}
                                        style={{
                                            width: isHiddenBySettings
                                                ? 0
                                                : colWidth + 'px',
                                            minWidth: isHiddenBySettings
                                                ? 0
                                                : colWidth + 'px',
                                            maxWidth: isHiddenBySettings
                                                ? 0
                                                : colWidth + 'px',
                                            padding: isHiddenBySettings
                                                ? 0
                                                : undefined,
                                            opacity: isHiddenBySettings ? 0 : 1,
                                            ...pinnedStyle,
                                        }}
                                    >
                                        {(() => {
                                            // If render exists, call it first
                                            if (column.render) {
                                                const rendered = column.render(
                                                    value,
                                                    row,
                                                    rowIndex
                                                )
                                                // If render returns undefined, fallback to formatter
                                                if (rendered !== undefined)
                                                    return rendered
                                            }
                                            // Use formatter if available
                                            if (column.formatter) {
                                                return renderFormatter(
                                                    value,
                                                    row,
                                                    column.formatter
                                                )
                                            }
                                            // Default: show raw value
                                            return (
                                                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {value}
                                                </div>
                                            )
                                        })()}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                        {/* Expanded row */}
                        {isExpanded && expandable && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="p-0"
                                >
                                    <div
                                        className={cn(
                                            'scrollbar-thin overflow-x-auto py-2 pr-4',
                                            selection ? 'pl-12' : 'pl-4'
                                        )}
                                    >
                                        {expandable.expandedRowRender ? (
                                            <ExpandedRowContent
                                                key={key}
                                                row={row}
                                                index={rowIndex}
                                                render={
                                                    expandable.expandedRowRender
                                                }
                                                loadingComponent={
                                                    expandable.loadingComponent
                                                }
                                                errorComponent={
                                                    expandable.errorComponent
                                                }
                                            />
                                        ) : expandable.expandedColumns &&
                                          expandable.expandedRowData &&
                                          DataTableComponent ? (
                                            <DataTableComponent
                                                columns={
                                                    expandable.expandedColumns
                                                }
                                                rows={expandable.expandedRowData(
                                                    row
                                                )}
                                                rowKey={
                                                    expandable.expandedRowKey ||
                                                    ((_, i) => i)
                                                }
                                                size="small"
                                                stickyHeader={{
                                                    enabled: false,
                                                }}
                                            />
                                        ) : null}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </Fragment>
                )
            })}
        </TableBody>
    )
}
