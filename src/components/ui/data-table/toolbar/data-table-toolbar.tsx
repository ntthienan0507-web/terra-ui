import { Fragment } from 'react/jsx-runtime'

export interface DataTableToolbarProps {
    /**
     * Selection component - rendered separately for responsive layout
     */
    selectionComponent?: React.ReactNode
    /**
     * Slot components - typically for action buttons (Add, Delete, etc.)
     */
    slotComponents?: React.ReactNode[]
    /**
     * Search component - rendered separately for responsive layout
     */
    searchComponent?: React.ReactNode
    /**
     * Optional className for the toolbar container
     */
    className?: string
}

/**
 * DataTableToolbar - A flexible toolbar component for DataTable
 *
 * Provides left and right slots for custom content.
 * Left slot is typically used for action buttons.
 * Right slot is typically used for filters and column visibility.
 *
 * @example
 * ```tsx
 * <DataTableToolbar
 *   slotComponents={[
 *     <ButtonGroup buttons={[
 *       { label: "Add", onClick: handleAdd },
 *       { label: "Delete", onClick: handleDelete }
 *     ]} />
 *   }
 *   slotComponents={[
 *     <ColumnVisibilityDropdown
 *       columns={columns}
 *       hiddenColumns={hiddenColumns}
 *       onToggle={toggleColumn}
 *     />
 *   }
 * />
 * ```
 */
export const DataTableToolbar = ({
    slotComponents,
    selectionComponent,
    searchComponent,
    className = '',
}: DataTableToolbarProps) => {
    // Don't render if both slots are empty
    if (!slotComponents && !searchComponent) {
        return null
    }

    return (
        <div
            className={`flex ${selectionComponent ? 'justify-between' : 'justify-end'} items-center ${className} gap-2`}
        >
            {selectionComponent}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end">
                <div
                    className="w-full"
                    aria-labelledby="ui:DataTable:SearchInput"
                >
                    {searchComponent}
                </div>
                {slotComponents &&
                    slotComponents?.filter(Boolean)?.length > 0 && (
                        <div className="flex items-center justify-end gap-2 ml-2">
                            {slotComponents?.map((component, index) => (
                                <Fragment key={index}>{component}</Fragment>
                            ))}
                        </div>
                    )}
            </div>
        </div>
    )
}
