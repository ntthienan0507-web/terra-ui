import { TableCell, TableRow } from '../../table'
import type {
    DataTableColumn,
    DataTableFooterRow as DataTableFooterRowType,
} from '../types'

interface DataTableFooterRowProps<T> {
    footerRow: DataTableFooterRowType<T>
    columns: DataTableColumn<T>[]
    bordered: boolean
    sizeConfig: {
        fontSize: string
        heightClass: string
        customHeight?: string
        customFontSize?: string
    }
    getColumnWidth: (column: DataTableColumn<T>) => number
    getPinnedPosition: (
        column: DataTableColumn<T>
    ) => 'left' | 'right' | undefined
    getPinnedStyle: (column: DataTableColumn<T>) => React.CSSProperties
}

/**
 * Footer row component for DataTable
 * Displays summary/aggregation data at the bottom of the table
 */
export const DataTableFooterRowComponent = <T,>({
    footerRow,
    columns,
    bordered,
    sizeConfig,
    getColumnWidth,
    getPinnedPosition,
    getPinnedStyle,
}: DataTableFooterRowProps<T>) => {
    return (
        <TableRow
            className={`${sizeConfig.heightClass} ${sizeConfig.fontSize} bg-gray-100`}
            style={{
                ...(sizeConfig.customHeight && {
                    height: sizeConfig.customHeight,
                }),
                ...(sizeConfig.customFontSize && {
                    fontSize: sizeConfig.customFontSize,
                }),
            }}
        >
            {columns.map((column) => {
                const cellValue = footerRow.cells[column.key]
                const content =
                    typeof cellValue === 'function'
                        ? cellValue(column)
                        : cellValue
                const colWidth = getColumnWidth(column)
                const pinnedStyle = getPinnedStyle(column)
                const isPinned = Object.keys(pinnedStyle).length > 0
                const pinnedPosition = getPinnedPosition(column)
                const isPinnedRight = pinnedPosition === 'right'

                return (
                    <TableCell
                        key={String(column.key)}
                        className={`font-semibold ${isPinnedRight ? 'bg-gray-100' : 'bg-gray-100'} ${footerRow.cellClassName || ''} ${column.cellClassName || ''} ${bordered ? 'border-x border-gray-200' : ''} ${isPinnedRight ? 'shadow-[-6px_0_10px_-3px_rgba(0,0,0,0.2)]' : isPinned ? 'shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : ''}`}
                        style={{
                            width: colWidth + 'px',
                            minWidth: colWidth + 'px',
                            maxWidth: colWidth + 'px',
                            ...pinnedStyle,
                        }}
                    >
                        {typeof content === 'function'
                            ? content(column)
                            : content}
                    </TableCell>
                )
            })}
        </TableRow>
    )
}
