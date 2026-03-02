import { useMemo, useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '../../button'
import { Sheet, SheetContent, SheetTrigger } from '../../sheet'
import { useLabels } from '../../../../lib/labels'
import { DisplaySettings } from './display-settings'
import { ColumnVisibility } from './column-visibility'
import { FilterToggles } from './filter-toggles'
import { ActionsSection } from './actions-section'
import {
    SettingsPopoverProps,
    DEFAULT_FONT_SIZE_OPTIONS,
    DEFAULT_ROW_HEIGHT_OPTIONS,
    SPECIAL_COLUMN_KEYS,
} from './types'

// Re-export types and constants
export {
    DEFAULT_FONT_SIZE_OPTIONS,
    DEFAULT_ROW_HEIGHT_OPTIONS,
    SPECIAL_COLUMN_KEYS,
}
export type { SettingsPopoverProps }

export function SettingsPopover<T>({
    showFontSize = true,
    fontSizeOptions = DEFAULT_FONT_SIZE_OPTIONS,
    fontSize,
    onFontSizeChange,
    showRowHeight = true,
    rowHeightOptions = DEFAULT_ROW_HEIGHT_OPTIONS,
    rowHeight,
    onRowHeightChange,
    showColumnVisibility = true,
    columns = [],
    hiddenColumns = new Set(),
    onToggleColumn,
    onResetColumns,
    columnsPinned = false,
    onColumnsPinnedChange,
    slotComponents,
    actionComponents,
    filterToggles,
    toggleValues = {},
    onToggleChange,
    hiddenOptions = {},
    onHiddenOptionsChange,
    tourId,
}: SettingsPopoverProps<T>) {
    const labels = useLabels()

    // Filter toggleable columns (exclude pinned and special columns)
    const toggleableColumns = useMemo(
        () =>
            columns.filter(
                (col) =>
                    !col.pinned &&
                    !SPECIAL_COLUMN_KEYS.includes(String(col.key))
            ),
        [columns]
    )

    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 min-w-8 p-0 hover:bg-gray-100"
                    title={labels.settingsTitle}
                    data-tour={tourId}
                >
                    <Settings className="h-4 w-4 text-gray-600" />
                </Button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className="w-[320px] sm:w-[380px] p-0 flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/80">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-sm">
                            {labels.tableSettings}
                        </span>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Display Settings */}
                    <DisplaySettings
                        showFontSize={showFontSize}
                        fontSizeOptions={fontSizeOptions}
                        fontSize={fontSize}
                        onFontSizeChange={onFontSizeChange}
                        showRowHeight={showRowHeight}
                        rowHeightOptions={rowHeightOptions}
                        rowHeight={rowHeight}
                        onRowHeightChange={onRowHeightChange}
                    />

                    {/* Column Visibility */}
                    {showColumnVisibility && toggleableColumns.length > 0 && (
                        <ColumnVisibility
                            columns={toggleableColumns}
                            hiddenColumns={hiddenColumns}
                            onToggleColumn={onToggleColumn}
                            onResetColumns={onResetColumns}
                            columnsPinned={columnsPinned}
                            onColumnsPinnedChange={onColumnsPinnedChange}
                        />
                    )}

                    {/* Filter Toggles */}
                    {filterToggles && filterToggles.length > 0 && (
                        <FilterToggles
                            filterToggles={filterToggles}
                            toggleValues={toggleValues}
                            onToggleChange={onToggleChange}
                            hiddenOptions={hiddenOptions}
                            onHiddenOptionsChange={onHiddenOptionsChange}
                        />
                    )}

                    {/* Actions */}
                    <ActionsSection
                        actionComponents={actionComponents}
                        slotComponents={slotComponents}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
