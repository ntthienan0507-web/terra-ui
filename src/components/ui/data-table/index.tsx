import { memo, useCallback, useMemo, type ReactElement } from 'react'

// Import types
import type {
    DataTableColumn,
    DataTableKey,
    DataTableProps,
    SortOrder,
} from './types'

// Import labels
import { DataTableLabelsProvider, defaultLabels, useLabels } from '../../../lib/labels'
import type { DataTableLabels } from '../../../lib/labels'

// Re-export types for consumers
export type {
    DataTableAction,
    DataTableColumn,
    DataTableExpandable,
    DataTableFooterRow,
    DataTableKey,
    DataTablePagination,
    DataTableProps,
    DataTableSelection,
    DataTableSelectionAction,
    DataTableSorting,
    FilterToggle,
    FilterToggleOption,
    SortOrder,
} from './types'

// Re-export formatter types
export type {
    FormatterConfig,
    ChipFormatterConfig,
    LinkFormatterConfig,
    DateFormatterConfig,
    NumberFormatterConfig,
    CurrencyFormatterConfig,
    BadgeFormatterConfig,
    BooleanFormatterConfig,
    AvatarFormatterConfig,
    TimeRangeFormatterConfig,
    OptionsFormatterConfig,
    OptionItem,
    ChipVariant,
    ChipSize,
    ChipColorConfig,
} from './data-table-formatters'

// Re-export GroupedTableHeader
export { GroupedTableHeader } from './data-table-core'
export type {
    GroupedHeaderCell,
    GroupedTableHeaderProps,
} from './data-table-core'

// Re-export toolbar components
export { DataTableToolbar } from './toolbar'
export type { DataTableToolbarProps } from './toolbar'

// Re-export formatter helper functions
export {
    createLinkFormatter,
    createChipFormatter,
    createOptionsFormatter,
    createDateFormatter,
    createTimeRangeFormatter,
    createNumberFormatter,
    createCurrencyFormatter,
    renderOptionsFormatter,
    renderFormatter,
} from './data-table-formatters'

// Import sub-components
import { PaginationFooter } from './pagination/pagination-footer'
import { useDataTableClientPagination } from './pagination/use-client-pagination'

// Import hooks
import { useDataTableColumnResize } from './hooks/use-data-table-column-resize'
import { useDataTableStickyHeader } from './hooks/use-data-table-sticky-header'
import { useDataTableSelection } from './hooks/use-data-table-selection'
import { useDataTableExpandable } from './hooks/use-data-table-expandable'
import { useDataTableColumnVisibility } from './hooks/use-data-table-column-visibility'
import { useDataTableSettings } from './hooks/use-data-table-settings'
import { useDataTableMobile } from './hooks/use-data-table-mobile'
import { useDataTableAutoWidth } from './hooks/use-data-table-auto-width'

// Import utilities
import {
    getRowKey as utilGetRowKey,
    getRowClassName as utilGetRowClassName,
    getCellValue as utilGetCellValue,
    getPinnedPosition as utilGetPinnedPosition,
    calculatePinnedPositions,
    getPinnedStyle as utilGetPinnedStyle,
    calculateTableWidth,
} from './utils/data-table-utils'
import { getSizeConfig } from './utils/data-table-size-config'
import { buildDataTableColumns } from './utils/data-table-column-builder'

// Import components
import { DataTableToolbarSection } from './toolbar/data-table-toolbar-section'
import { DataTableMainContainer } from './data-table-core'

/**
 * Helper function to create type-safe column definitions
 */
export function createColumns<T>(
    columns: DataTableColumn<T>[]
): DataTableColumn<T>[] {
    return columns
}

const DataTableComponent = <T = any,>({
    columns,
    rows,
    pagination,
    selection,
    sorting,
    showIndex = false,
    footerRow,
    maxHeight,
    pinnedHeader = false,
    expandable,
    loading = false,
    isFetching = false,
    emptyMessage,
    loadingMessage,
    toolbar,
    className = '',
    tableClassName = '',
    rowKey,
    onRowClick,
    rowClassName,
    size = 'small',
    customRowHeight,
    customFontSize,
    bordered = false,
    resizable = false,
    autoWidth = false,
    actions,
    customHeader,
    stickyHeader,
    labels: labelOverrides,
}: DataTableProps<T>) => {
    const parentLabels = useLabels()
    const labels: DataTableLabels = useMemo(
        () => ({ ...parentLabels, ...labelOverrides }),
        [parentLabels, labelOverrides]
    )

    const resolvedEmptyMessage = emptyMessage ?? labels.noData
    const resolvedLoadingMessage = loadingMessage ?? labels.loading

    // Extract hooks
    const { isMobile } = useDataTableMobile()
    const { paginatedRows, totalPages, pageSizeOptions } =
        useDataTableClientPagination(rows, pagination)

    // Use extracted hooks
    const columnResize = useDataTableColumnResize<T>()
    const stickyHeaderHook = useDataTableStickyHeader<T>(
        stickyHeader,
        isMobile,
        rows
    )
    const selectionHook = useDataTableSelection<T>(selection, rows)
    const expandableHook = useDataTableExpandable<T>(expandable)
    const settingsHook = useDataTableSettings(toolbar?.settings?.storageKey)

    // Use controlled or internal state for hidden columns
    const hiddenColumns =
        toolbar?.hiddenColumns ?? settingsHook.internalHiddenColumns
    const setHiddenColumns =
        toolbar?.onHiddenColumnsChange ?? settingsHook.setInternalHiddenColumns

    // Column visibility management
    const columnVisibility = useDataTableColumnVisibility(
        hiddenColumns,
        setHiddenColumns
    )

    // Use controlled or internal settings state
    const settingsFontSize =
        toolbar?.settings?.fontSize ?? settingsHook.internalFontSize
    const setSettingsFontSize =
        toolbar?.settings?.onFontSizeChange ?? settingsHook.setInternalFontSize
    const settingsRowHeight =
        toolbar?.settings?.rowHeight ?? settingsHook.internalRowHeight
    const setSettingsRowHeight =
        toolbar?.settings?.onRowHeightChange ??
        settingsHook.setInternalRowHeight
    const internalColumnsPinned = settingsHook.internalColumnsPinned
    const setInternalColumnsPinned = settingsHook.setInternalColumnsPinned
    const internalToggleValues = settingsHook.internalToggleValues
    const internalHiddenOptions = settingsHook.internalHiddenOptions

    // Get size configuration
    const sizeConfig = getSizeConfig(
        size,
        customRowHeight,
        customFontSize,
        settingsFontSize,
        settingsRowHeight,
        toolbar?.settings?.show
    )

    // Handle sorting
    const handleSort = useCallback(
        (columnKey: string) => {
            if (columnResize.justResizedRef.current) return
            if (!sorting) return
            const newOrder: SortOrder =
                sorting.sortBy === columnKey && sorting.sortOrder === 'asc'
                    ? 'desc'
                    : 'asc'
            sorting.onSortChange(columnKey, newOrder)
        },
        [sorting, columnResize.justResizedRef]
    )

    // Build final columns using utility
    const finalColumns = useMemo(
        () =>
            buildDataTableColumns<T>({
                columns,
                rows,
                selection,
                showIndex,
                pagination,
                expandable,
                expandedKeys: expandableHook.expandedKeys,
                actions,
                isAllSelected: selectionHook.isAllSelected,
                isSomeSelected: selectionHook.isSomeSelected,
                selectableRows: selectionHook.selectableRows,
                handleSelectAll: selectionHook.handleSelectAll,
                handleSelectRow: selectionHook.handleSelectRow,
                handleToggleExpand: expandableHook.handleToggleExpand,
                isRowSelectable: selectionHook.isRowSelectable,
                rowKey,
                labels: { indexColumnTitle: labels.indexColumnTitle },
            }),
        [
            columns,
            rows,
            selection,
            showIndex,
            pagination,
            expandable,
            expandableHook.expandedKeys,
            actions,
            selectionHook.isAllSelected,
            selectionHook.isSomeSelected,
            selectionHook.selectableRows,
            selectionHook.handleSelectAll,
            selectionHook.handleSelectRow,
            expandableHook.handleToggleExpand,
            selectionHook.isRowSelectable,
            rowKey,
            labels.indexColumnTitle,
        ]
    )

    // Calculate pinned column positions using utility
    const getPinnedPosition = useCallback(
        (column: DataTableColumn<T>) => utilGetPinnedPosition(column),
        []
    )

    const pinnedPositions = useMemo(
        () =>
            calculatePinnedPositions(finalColumns, columnResize.getColumnWidth),
        [finalColumns, columnResize.getColumnWidth]
    )

    const getPinnedStyle = useCallback(
        (column: DataTableColumn<T>) =>
            utilGetPinnedStyle(column, pinnedPositions),
        [pinnedPositions]
    )

    // Calculate total table width using utility
    const tableWidth = useMemo(
        () => calculateTableWidth(finalColumns, columnResize.getColumnWidth),
        [finalColumns, columnResize.getColumnWidth]
    )

    // Auto-fit columns when enabled
    useDataTableAutoWidth(
        autoWidth,
        rows,
        finalColumns,
        columnResize.tableRef,
        columnResize.getColumnWidth
    )

    // Utility wrappers for row operations
    const getRowKey = useCallback(
        (row: T, index: number) => utilGetRowKey(row, index, rowKey),
        [rowKey]
    )

    const getRowClassName = useCallback(
        (row: T, index: number) =>
            utilGetRowClassName(row, index, rowClassName, onRowClick),
        [rowClassName, onRowClick]
    )

    const getCellValue = useCallback(
        (row: T, columnKey: DataTableKey<T>) =>
            utilGetCellValue(row, columnKey),
        []
    )

    return (
        <DataTableLabelsProvider value={labels}>
            <div className={className} aria-labelledby="ui:DataTable">
                {/* Toolbar & Selection Actions */}
                <DataTableToolbarSection
                    toolbar={toolbar}
                    finalColumns={finalColumns}
                    columns={columns}
                    hiddenColumns={hiddenColumns}
                    toggleColumn={columnVisibility.toggleColumn}
                    resetColumns={columnVisibility.resetColumns}
                    settingsFontSize={settingsFontSize}
                    setSettingsFontSize={setSettingsFontSize}
                    settingsRowHeight={settingsRowHeight}
                    setSettingsRowHeight={setSettingsRowHeight}
                    internalColumnsPinned={internalColumnsPinned}
                    setInternalColumnsPinned={setInternalColumnsPinned}
                    internalToggleValues={internalToggleValues}
                    handleToggleChange={settingsHook.handleToggleChange}
                    internalHiddenOptions={internalHiddenOptions}
                    handleHiddenOptionsChange={
                        settingsHook.handleHiddenOptionsChange
                    }
                    selection={selection}
                    rows={rows}
                    selectedRowsCacheRef={selectionHook.selectedRowsCacheRef}
                    DataTableComponent={DataTableCustomized}
                />

                {/* Main Table Container */}
                <DataTableMainContainer
                    tableWrapperRef={stickyHeaderHook.tableWrapperRef}
                    tableScrollContainerRef={
                        stickyHeaderHook.tableScrollContainerRef
                    }
                    maxHeight={maxHeight}
                    isFetching={isFetching}
                    loading={loading}
                    rows={rows}
                    hasPagination={!!(pagination && pagination.total > 0)}
                    stickyHeaderHook={stickyHeaderHook}
                    stickyHeaderZIndex={stickyHeader?.zIndex}
                    tableRef={columnResize.tableRef}
                    tableClassName={tableClassName}
                    tableWidth={tableWidth}
                    columns={finalColumns}
                    sorting={sorting}
                    resizable={resizable}
                    pinnedHeader={pinnedHeader}
                    hiddenColumns={hiddenColumns}
                    sizeConfig={sizeConfig}
                    getColumnWidth={columnResize.getColumnWidth}
                    getPinnedPosition={getPinnedPosition}
                    getPinnedStyle={getPinnedStyle}
                    handleSort={handleSort}
                    handleResizeStart={columnResize.handleResizeStart}
                    handleResizeMove={columnResize.handleResizeMove}
                    handleResizeEnd={columnResize.handleResizeEnd}
                    handleAutoFitColumn={columnResize.handleAutoFitColumn}
                    paginatedRows={paginatedRows}
                    emptyMessage={resolvedEmptyMessage}
                    loadingMessage={resolvedLoadingMessage}
                    bordered={bordered}
                    selection={selection}
                    expandable={expandable}
                    expandedKeys={expandableHook.expandedKeys}
                    getRowKey={getRowKey}
                    getRowClassName={getRowClassName}
                    getCellValue={getCellValue}
                    onRowClick={onRowClick}
                    footerRow={footerRow}
                    customHeader={customHeader}
                />

                {/* Pagination Footer */}
                {pagination && pagination.total > 0 && (
                    <div className="border border-t-0 rounded-b-sm overflow-hidden bg-white relative z-10">
                        <PaginationFooter
                            page={pagination.page}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            totalPages={totalPages}
                            pageSizeOptions={pageSizeOptions}
                            onPageChange={pagination.onPageChange}
                            onPageSizeChange={pagination.onPageSizeChange}
                            loading={loading}
                        />
                    </div>
                )}
            </div>
        </DataTableLabelsProvider>
    )
}

// Export memoized version to prevent unnecessary re-renders
export const DataTableCustomized = memo(DataTableComponent) as <T = any>(
    props: DataTableProps<T>
) => ReactElement
