import { Table, TableHeader } from '../../table'
import type { DataTableColumn, DataTableSorting } from '../types'
import { DataTableHeaderRow } from './header-row'

interface DataTableStickyHeaderCloneProps<T> {
    isEnabled: boolean
    isSticky: boolean
    width: number
    left: number
    offsetTop: number
    zIndex?: number
    scrollRef: React.RefObject<HTMLDivElement>
    tableWidth: number
    tableClassName?: string
    columns: DataTableColumn<T>[]
    sorting?: DataTableSorting
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
}

/**
 * Sticky header clone component for DataTable
 * Displays a fixed header when scrolling past the original header
 */
export const DataTableStickyHeaderClone = <T,>({
    isEnabled,
    isSticky,
    width,
    left,
    offsetTop,
    zIndex = 40,
    scrollRef,
    tableWidth,
    tableClassName,
    columns,
    sorting,
    hiddenColumns,
    sizeConfig,
    getColumnWidth,
    getPinnedPosition,
    getPinnedStyle,
    handleSort,
}: DataTableStickyHeaderCloneProps<T>) => {
    if (!isEnabled || !isSticky || width === 0) {
        return null
    }

    return (
        <div
            className="fixed bg-white border-b border-gray-200 shadow-md overflow-hidden"
            aria-labelledby="ui:DataTable:DataTableStickyHeaderClone"
            style={{
                top: offsetTop,
                left: left,
                width: width,
                zIndex: zIndex,
                display: width > 0 && left >= 0 ? 'block' : 'none',
            }}
        >
            <div
                ref={scrollRef}
                className="scrollbar-thin overflow-x-auto"
                style={{ overflowY: 'hidden' }}
            >
                <Table
                    className={tableClassName}
                    style={{
                        minWidth: `${tableWidth}px`,
                        tableLayout: 'fixed',
                    }}
                >
                    <TableHeader>
                        <DataTableHeaderRow
                            columns={columns}
                            sorting={sorting}
                            resizable={false}
                            hiddenColumns={hiddenColumns}
                            sizeConfig={sizeConfig}
                            getColumnWidth={getColumnWidth}
                            getPinnedPosition={getPinnedPosition}
                            getPinnedStyle={getPinnedStyle}
                            handleSort={handleSort}
                        />
                    </TableHeader>
                </Table>
            </div>
        </div>
    )
}
