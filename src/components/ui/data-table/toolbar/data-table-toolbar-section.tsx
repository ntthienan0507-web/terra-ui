import type { ReactNode, ReactElement } from 'react'
import { DataTableToolbar } from './data-table-toolbar'
import { SearchInput } from '../../search-input'
import { ColumnVisibilityDropdown } from './column-visibility-dropdown'
import { SettingsPopover } from '../data-table-settings-popover'
import { DataTableSelectionActionsWrapper } from '../selection'
import type {
    DataTableColumn,
    DataTableSelection,
    DataTableProps,
} from '../types'

interface DataTableToolbarSectionProps<T> {
    toolbar?: DataTableProps<T>['toolbar']
    finalColumns: DataTableColumn<T>[]
    columns: DataTableColumn<T>[]
    hiddenColumns: Set<string>
    toggleColumn: (columnKey: string) => void
    resetColumns: () => void
    settingsFontSize?: string
    setSettingsFontSize?: (fontSize: string) => void
    settingsRowHeight?: string
    setSettingsRowHeight?: (rowHeight: string) => void
    internalColumnsPinned: boolean
    setInternalColumnsPinned: (pinned: boolean) => void
    internalToggleValues: Record<string, boolean>
    handleToggleChange: (key: string, value: boolean) => void
    internalHiddenOptions: Record<string, string[]>
    handleHiddenOptionsChange: (key: string, values: string[]) => void
    // Selection props
    selection?: DataTableSelection<T>
    rows: T[]
    selectedRowsCacheRef: React.MutableRefObject<Map<string, T>>
    DataTableComponent: <T = any>(props: DataTableProps<T>) => ReactElement
}

/**
 * Toolbar section component for DataTable
 * Handles rendering of search, column visibility, settings, and selection actions
 */
export const DataTableToolbarSection = <T,>({
    toolbar,
    finalColumns,
    columns,
    hiddenColumns,
    toggleColumn,
    resetColumns,
    settingsFontSize,
    setSettingsFontSize,
    settingsRowHeight,
    setSettingsRowHeight,
    internalColumnsPinned,
    setInternalColumnsPinned,
    internalToggleValues,
    handleToggleChange,
    internalHiddenOptions,
    handleHiddenOptionsChange,
    selection,
    rows,
    selectedRowsCacheRef,
    DataTableComponent,
}: DataTableToolbarSectionProps<T>) => {
    const shouldShowToolbar =
        toolbar &&
        (toolbar.visibilityColumn ||
            toolbar.slotComponents ||
            toolbar.settings?.show ||
            toolbar.search)

    // If no toolbar but has selection, only show selection bar
    if (!shouldShowToolbar) {
        return (
            <DataTableSelectionActionsWrapper
                selection={selection}
                rows={rows}
                selectedRowsCacheRef={selectedRowsCacheRef}
                DataTableComponent={DataTableComponent}
            />
        )
    }

    const slotComponents: (ReactNode | undefined)[] = [
        internalColumnsPinned ? (
            <ColumnVisibilityDropdown
                key="column-visibility"
                columns={finalColumns}
                hiddenColumns={hiddenColumns}
                onToggle={toggleColumn}
                canToggle={toolbar.canToggleColumn}
                compact={toolbar.visibilityColumnProps?.compact ?? true}
                showChevron={toolbar.visibilityColumnProps?.showChevron ?? true}
                buttonLabel={toolbar.visibilityColumnProps?.buttonLabel}
            />
        ) : undefined,
        ...(toolbar?.slotComponents || []),
        toolbar?.settings?.show ? (
            <SettingsPopover
                key="settings"
                showFontSize={toolbar.settings.showFontSize ?? true}
                fontSizeOptions={toolbar.settings.fontSizeOptions}
                fontSize={settingsFontSize}
                onFontSizeChange={setSettingsFontSize}
                showRowHeight={toolbar.settings.showRowHeight ?? true}
                rowHeightOptions={toolbar.settings.rowHeightOptions}
                rowHeight={settingsRowHeight}
                onRowHeightChange={setSettingsRowHeight}
                showColumnVisibility={
                    toolbar.settings.showColumnVisibility ?? true
                }
                columns={columns}
                hiddenColumns={hiddenColumns}
                onToggleColumn={toggleColumn}
                onResetColumns={resetColumns}
                columnsPinned={internalColumnsPinned}
                onColumnsPinnedChange={setInternalColumnsPinned}
                slotComponents={toolbar.settings.slotComponents}
                actionComponents={toolbar.settings.actionComponents}
                filterToggles={toolbar.settings.filterToggles}
                toggleValues={internalToggleValues}
                onToggleChange={handleToggleChange}
                hiddenOptions={internalHiddenOptions}
                onHiddenOptionsChange={handleHiddenOptionsChange}
                tourId={toolbar.settings.tourId}
            />
        ) : undefined,
    ]

    return (
        <div className="mb-2" aria-labelledby="ui:DataTable:DataTableToolbar">
            <DataTableToolbar
                className={toolbar?.className}
                searchComponent={
                    toolbar?.search ? (
                        <SearchInput
                            value={toolbar.search.value}
                            onChange={toolbar.search.onChange}
                            placeholder={toolbar.search.placeholder}
                            className={
                                toolbar.search.className ?? 'w-full sm:w-80'
                            }
                            tourId={toolbar.search.tourId}
                        />
                    ) : undefined
                }
                selectionComponent={
                    selection &&
                    selection.selectedKeys.length > 0 &&
                    !selection.hideSelectionBar ? (
                        <DataTableSelectionActionsWrapper
                            key="selection-actions"
                            selection={selection}
                            rows={rows}
                            selectedRowsCacheRef={selectedRowsCacheRef}
                            DataTableComponent={DataTableComponent}
                        />
                    ) : undefined
                }
                slotComponents={slotComponents}
            />
        </div>
    )
}
