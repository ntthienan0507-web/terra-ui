import type { Control, FieldValues, Path } from 'react-hook-form'

export interface FilterMultiSelectOption {
    label: string
    value: string | number
}

export interface FilterMultiSelectProps<T extends FieldValues> {
    /** react-hook-form control */
    control: Control<T>
    /** Field name */
    name: Path<T>
    /** Select options */
    options: FilterMultiSelectOption[]
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
    /** Callback after value change (for URL sync) */
    onChangeAfterHookForm?: (value: (string | number)[]) => void
}
