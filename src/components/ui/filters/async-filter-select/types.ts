import type { Control, FieldValues, Path } from 'react-hook-form'

export interface AsyncFilterSelectOption {
    label: string
    value: string | number
}

export interface AsyncFilterSelectPage {
    options: AsyncFilterSelectOption[]
    hasMore: boolean
    nextPage?: number
}

export interface AsyncFilterSelectProps<T extends FieldValues> {
    /** react-hook-form control */
    control: Control<T>
    /** Field name */
    name: Path<T>
    /** Async function to fetch options with pagination */
    asyncOptions: (
        query: string,
        page?: number
    ) => Promise<AsyncFilterSelectOption[] | AsyncFilterSelectPage>
    /** Async function to get options for selected values */
    getDefaultOptions?: (values: any[]) => Promise<AsyncFilterSelectOption[]>
    /** Label text */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Search placeholder */
    searchPlaceholder?: string
    /** Empty state text */
    emptyText?: string
    /** Additional className for trigger */
    className?: string
    /** Disabled state */
    disabled?: boolean
    /** Allow multiple selection */
    multiple?: boolean
    /** Show clear button (default: true) */
    showClearButton?: boolean
    /** Callback after value change */
    onChangeAfterHookForm?: (value: any) => void
    /** Unique query key for caching */
    queryKey?: string
    /** Page size for pagination (default: 5) */
    pageSize?: number
}

export interface OverflowChipsProps {
    options: AsyncFilterSelectOption[]
    values: (string | number)[]
    onRemove: (e: React.MouseEvent, value: any) => void
    placeholder: string
    disabled?: boolean
}
