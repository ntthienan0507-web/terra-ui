import { Table, TableHeader } from '../../table'
import type {
    DataTableColumn,
    DataTableSorting,
    DataTableFooterRow,
    DataTableExpandable,
    DataTableSelection,
} from '../types'
import { DataTableHeaderRow } from './header-row'
import { DataTableBodyRows } from './body-rows'
import { DataTableFooterRowComponent } from './footer-row'
import { DataTableStickyHeaderClone } from './sticky-header-clone'

// Re-export components for external use
export { DataTableHeaderRow } from './header-row'
export { DataTableBodyRows } from './body-rows'
export { DataTableFooterRowComponent } from './footer-row'
export { DataTableStickyHeaderClone } from './sticky-header-clone'
export { ExpandedRowContent } from './expanded-row'
export { SortIcon } from './sort-icon'
export { GroupedTableHeader } from './grouped-table-header'
export type {
    GroupedHeaderCell,
    GroupedTableHeaderProps,
} from './grouped-table-header'

interface DataTableMainContainerProps<T> {
    // Table wrapper props
    tableWrapperRef: React.RefObject<HTMLDivElement>
    tableScrollContainerRef: React.RefObject<HTMLDivElement>
    maxHeight?: string
    isFetching: boolean
    loading: boolean
    rows: T[]
    hasPagination?: boolean

    // Sticky header props
    stickyHeaderHook: {
        isStickyHeaderEnabled: boolean
        isHeaderSticky: boolean
        stickyHeaderWidth: number
        stickyHeaderLeft: number
        calculatedOffsetTop: number
        stickyHeaderScrollRef: React.RefObject<HTMLDivElement>
        headerSentinelRef: React.RefObject<HTMLDivElement>
    }
    stickyHeaderZIndex?: number

    // Table props
    tableRef: React.RefObject<HTMLTableElement>
    tableClassName?: string
    tableWidth: number

    // Header props
    columns: DataTableColumn<T>[]
    sorting?: DataTableSorting
    resizable?: boolean
    pinnedHeader?: boolean
    hiddenColumns: Set<string>
    sizeConfig: {
        fontSize: string
        heightClass: string
        customHeight?: string
        customFontSize?: string
    }

    // Column handlers
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

    // Body props
    paginatedRows: T[]
    emptyMessage: string
    loadingMessage: string
    bordered: boolean
    selection?: DataTableSelection<T>
    expandable?: DataTableExpandable<T>
    expandedKeys: string[]
    getRowKey: (row: T, index: number) => string
    getRowClassName: (row: T, index: number) => string
    getCellValue: (row: T, columnKey: any) => any
    onRowClick?: (row: T, index: number) => void

    // Footer props
    footerRow?: DataTableFooterRow<T>

    // Custom header (replaces default single-row header)
    customHeader?: React.ReactNode
}

/**
 * Main table container component
 * Handles sticky header clone, progress bar, scroll container, and table rendering
 */
export const DataTableMainContainer = <T,>({
    tableWrapperRef,
    tableScrollContainerRef,
    maxHeight,
    isFetching,
    loading,
    rows,
    hasPagination = false,
    stickyHeaderHook,
    stickyHeaderZIndex,
    tableRef,
    tableClassName,
    tableWidth,
    columns,
    sorting,
    resizable,
    pinnedHeader,
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
    paginatedRows,
    emptyMessage,
    loadingMessage,
    bordered,
    selection,
    expandable,
    expandedKeys,
    getRowKey,
    getRowClassName,
    getCellValue,
    onRowClick,
    footerRow,
    customHeader,
}: DataTableMainContainerProps<T>) => {
    return (
        <>
            {/* Sticky Header Sentinel */}
            {stickyHeaderHook.isStickyHeaderEnabled &&
                rows.length > 0 &&
                !loading && (
                    <div
                        ref={stickyHeaderHook.headerSentinelRef}
                        className="h-0 w-full"
                    />
                )}

            {/* Table with integrated pagination */}
            <div
                ref={tableWrapperRef}
                className={`border ${hasPagination ? 'border-b-0 rounded-t-sm' : 'rounded-sm'} overflow-hidden bg-white relative z-10`}
                aria-labelledby="ui:DataTable:DataTableMainContainer"
            >
                {/* Sticky Header Clone */}
                {rows.length > 0 && (
                    <DataTableStickyHeaderClone
                        isEnabled={stickyHeaderHook.isStickyHeaderEnabled}
                        isSticky={stickyHeaderHook.isHeaderSticky}
                        width={stickyHeaderHook.stickyHeaderWidth}
                        left={stickyHeaderHook.stickyHeaderLeft}
                        offsetTop={stickyHeaderHook.calculatedOffsetTop}
                        zIndex={stickyHeaderZIndex}
                        scrollRef={stickyHeaderHook.stickyHeaderScrollRef}
                        tableWidth={tableWidth}
                        tableClassName={tableClassName}
                        columns={columns}
                        sorting={sorting}
                        hiddenColumns={hiddenColumns}
                        sizeConfig={sizeConfig}
                        getColumnWidth={getColumnWidth}
                        getPinnedPosition={getPinnedPosition}
                        getPinnedStyle={getPinnedStyle}
                        handleSort={handleSort}
                    />
                )}

                {/* Linear Progress Bar */}
                {(isFetching || (loading && rows.length > 0)) && (
                    <div className="absolute top-0 left-0 right-0 h-1 z-30 overflow-hidden bg-blue-100">
                        <div className="h-full bg-blue-500 animate-progress-indeterminate" />
                    </div>
                )}

                <div
                    ref={tableScrollContainerRef}
                    className={`scrollbar-thin ${maxHeight ? 'overflow-auto' : 'overflow-x-auto'} ${isFetching || (loading && rows.length > 0) ? 'opacity-60 pointer-events-none' : ''}`}
                    style={maxHeight ? { maxHeight } : undefined}
                >
                    <Table
                        ref={tableRef}
                        className={tableClassName}
                        style={{
                            minWidth: `${tableWidth}px`,
                            tableLayout: 'fixed',
                        }}
                    >
                        {customHeader || (
                            <TableHeader
                                style={
                                    pinnedHeader && maxHeight
                                        ? {
                                              position: 'sticky',
                                              top: 0,
                                              zIndex: 20,
                                          }
                                        : undefined
                                }
                            >
                                <DataTableHeaderRow
                                    columns={columns}
                                    sorting={sorting}
                                    resizable={resizable}
                                    hiddenColumns={hiddenColumns}
                                    sizeConfig={sizeConfig}
                                    getColumnWidth={getColumnWidth}
                                    getPinnedPosition={getPinnedPosition}
                                    getPinnedStyle={getPinnedStyle}
                                    handleSort={handleSort}
                                    handleResizeStart={handleResizeStart}
                                    handleResizeMove={handleResizeMove}
                                    handleResizeEnd={handleResizeEnd}
                                    handleAutoFitColumn={handleAutoFitColumn}
                                />
                            </TableHeader>
                        )}
                        <DataTableBodyRows
                            rows={paginatedRows}
                            columns={columns}
                            loading={loading}
                            emptyMessage={emptyMessage}
                            loadingMessage={loadingMessage}
                            bordered={bordered}
                            selection={selection}
                            expandable={expandable}
                            expandedKeys={expandedKeys}
                            sizeConfig={sizeConfig}
                            hiddenColumns={hiddenColumns}
                            getRowKey={getRowKey}
                            getRowClassName={getRowClassName}
                            getCellValue={getCellValue}
                            getColumnWidth={getColumnWidth}
                            getPinnedPosition={getPinnedPosition}
                            getPinnedStyle={getPinnedStyle}
                            onRowClick={onRowClick}
                        />

                        {/* Footer Row */}
                        {footerRow && !loading && paginatedRows.length > 0 && (
                            <tfoot
                                className={`bg-gray-100 border-t border-gray-200 ${footerRow.className || ''}`}
                                style={
                                    pinnedHeader && maxHeight
                                        ? {
                                              position: 'sticky',
                                              bottom: 0,
                                              zIndex: 20,
                                          }
                                        : undefined
                                }
                            >
                                <DataTableFooterRowComponent
                                    footerRow={footerRow}
                                    columns={columns}
                                    bordered={bordered}
                                    sizeConfig={sizeConfig}
                                    getColumnWidth={getColumnWidth}
                                    getPinnedPosition={getPinnedPosition}
                                    getPinnedStyle={getPinnedStyle}
                                />
                            </tfoot>
                        )}
                    </Table>
                </div>
            </div>
        </>
    )
}
