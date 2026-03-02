import { Button } from '../../button'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../../dropdown-menu'
import { ChevronDown, Settings2 } from 'lucide-react'
import type { DataTableColumn } from '../types'
import { useLabels } from '../../../../lib/labels'

export interface ColumnVisibilityDropdownProps<T = any> {
    /**
     * All columns from the DataTable
     */
    columns: DataTableColumn<T>[]
    /**
     * Set of hidden column keys
     */
    hiddenColumns: Set<string>
    /**
     * Callback when a column visibility is toggled
     */
    onToggle: (columnKey: string) => void
    /**
     * Optional: Callback when "Select All" or "Deselect All" is triggered
     * If not provided, will call onToggle for each column individually
     */
    onToggleAll?: (show: boolean) => void
    /**
     * Optional: Filter function to determine which columns can be toggled
     * Return false to exclude a column from the dropdown
     */
    canToggle?: (column: DataTableColumn<T>) => boolean
    /**
     * Optional: Custom label for columns
     * If not provided, uses column.title
     */
    getLabel?: (column: DataTableColumn<T>) => string
    /**
     * Optional: Button size
     * @default "sm"
     */
    size?: 'sm' | 'default' | 'lg' | 'icon'
    /**
     * Optional: Button variant
     * @default "outline"
     */
    variant?:
        | 'default'
        | 'destructive'
        | 'outline'
        | 'secondary'
        | 'ghost'
        | 'link'
    /**
     * Optional: Custom button label
     * @default labels.columns
     */
    buttonLabel?: string
    /**
     * Optional: Use compact style (no header, no select all)
     * @default false
     */
    compact?: boolean
    /**
     * Optional: Show chevron icon instead of Settings2
     * @default false
     */
    showChevron?: boolean
    /**
     * Optional: Additional className for the button
     */
    className?: string
}

/**
 * ColumnVisibilityDropdown - A reusable dropdown for toggling column visibility
 *
 * Features:
 * - Individual column toggle
 * - "Select All" / "Deselect All" option at the top
 * - Automatic indeterminate state when some columns are hidden
 * - Dynamic label: "Select all" when not all visible, "Deselect all" when all visible
 *
 * @example Basic usage
 * ```tsx
 * <ColumnVisibilityDropdown
 *   columns={columns}
 *   hiddenColumns={hiddenColumns}
 *   onToggle={toggleColumn}
 *   canToggle={(col) => col.key !== "stt"} // Don't allow hiding STT column
 * />
 * ```
 *
 * @example With custom toggle all handler
 * ```tsx
 * <ColumnVisibilityDropdown
 *   columns={columns}
 *   hiddenColumns={hiddenColumns}
 *   onToggle={toggleColumn}
 *   onToggleAll={(show) => {
 *     // Custom batch operation
 *     if (show) {
 *       setHiddenColumns(new Set());
 *     } else {
 *       setHiddenColumns(new Set(columns.map(c => c.key)));
 *     }
 *   }}
 * />
 * ```
 */
export const ColumnVisibilityDropdown = <T,>({
    columns,
    hiddenColumns,
    onToggle,
    onToggleAll,
    canToggle,
    getLabel,
    size = 'sm',
    variant = 'outline',
    buttonLabel,
    compact = false,
    showChevron = false,
    className,
}: ColumnVisibilityDropdownProps<T>) => {
    const labels = useLabels()

    // Special column keys that cannot be hidden
    const SPECIAL_COLUMN_KEYS = [
        '__selection__',
        '__expand__',
        '__index__',
        'actions',
    ]

    // Filter toggleable columns
    const toggleableColumns = columns.filter((col) => {
        if (canToggle) {
            return canToggle(col)
        }
        // Default: all columns except special ones can be toggled
        const key = String(col.key)
        return !key.startsWith('__') && !SPECIAL_COLUMN_KEYS.includes(key)
    })

    // Don't render if no toggleable columns
    if (toggleableColumns.length === 0) {
        return null
    }

    const resolvedButtonLabel = buttonLabel ?? labels.columns

    const getColumnLabel = (column: DataTableColumn<T>): string => {
        if (getLabel) {
            return getLabel(column)
        }
        if (typeof column.title === 'string') {
            return column.title
        }
        return String(column.key)
    }

    // Check if all columns are visible
    const allVisible = toggleableColumns.every(
        (col) => !hiddenColumns.has(String(col.key))
    )
    // Check if all columns are hidden
    const allHidden = toggleableColumns.every((col) =>
        hiddenColumns.has(String(col.key))
    )
    // Determine checkbox state: checked if all visible, indeterminate if some visible
    const isAllChecked = allVisible
    const isIndeterminate = !allVisible && !allHidden

    // Handle toggle all
    const handleToggleAll = () => {
        if (onToggleAll) {
            // Use custom callback if provided
            onToggleAll(!allVisible)
        } else {
            // Default behavior: toggle each column individually
            toggleableColumns.forEach((col) => {
                const key = String(col.key)
                const shouldShow = !allVisible // If not all visible, show all; otherwise hide all
                const isCurrentlyHidden = hiddenColumns.has(key)

                // Only toggle if state needs to change
                if (shouldShow && isCurrentlyHidden) {
                    onToggle(key)
                } else if (!shouldShow && !isCurrentlyHidden) {
                    onToggle(key)
                }
            })
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    type="button"
                    className={`h-9 ${className || ''}`}
                >
                    {showChevron ? (
                        <>
                            {resolvedButtonLabel}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                    ) : (
                        <>
                            <Settings2 className="h-4 w-4 mr-2" />
                            {resolvedButtonLabel}
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {!compact && (
                    <>
                        <DropdownMenuLabel>{labels.displayOptions}</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {/* Select All / Deselect All option */}
                        <DropdownMenuCheckboxItem
                            checked={isAllChecked}
                            onCheckedChange={handleToggleAll}
                            className="font-medium"
                        >
                            <span
                                className={isIndeterminate ? 'opacity-60' : ''}
                            >
                                {allVisible ? labels.deselectAll : labels.selectAll}
                            </span>
                        </DropdownMenuCheckboxItem>

                        <DropdownMenuSeparator />
                    </>
                )}

                {/* Individual column toggles */}
                {toggleableColumns.map((col) => (
                    <DropdownMenuCheckboxItem
                        key={String(col.key)}
                        checked={!hiddenColumns.has(String(col.key))}
                        onCheckedChange={() => onToggle(String(col.key))}
                    >
                        {getColumnLabel(col)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
