import { ReactNode } from 'react'
import {
    Control,
    FieldValues,
    Path,
    ControllerRenderProps,
    UseFormSetValue,
} from 'react-hook-form'

/**
 * Floating label styles - consistent across all form components
 * Used by: FormField, FilterSelect, AsyncFilterSelect, FilterMultiSelect, TextareaAutoResize
 *
 * Usage:
 * - Standard (white bg): cn(FLOATING_LABEL_STYLES.base, FLOATING_LABEL_STYLES.bg, FLOATING_LABEL_STYLES.default)
 * - Custom bg: cn(FLOATING_LABEL_STYLES.base, 'bg-primary/5', FLOATING_LABEL_STYLES.default)
 */
export const FLOATING_LABEL_STYLES = {
    /** Position & size (no background) */
    base: 'absolute -top-2.5 left-2 px-1 text-[11px] z-10 pointer-events-none',
    /** Default background - use bg-background for standard forms */
    bg: 'bg-background',
    /** Default text color */
    default: 'text-muted-foreground',
    /** Error text color */
    error: 'text-destructive',
} as const

export type FormFieldType =
    | 'textfield'
    | 'textarea'
    | 'number'
    | 'select'
    | 'checkbox'
    | 'switch'
    | 'datepicker'
    | 'daterangepicker'

export interface SelectOption {
    label: string
    value: string | number
}

export interface FormFieldBaseProps<T extends FieldValues> {
    /** react-hook-form control */
    control: Control<T>
    /** Field name path */
    name: Path<T>
    /** Field label */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Required field indicator */
    required?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Helper text below field */
    helperText?: string
    /** Additional className */
    className?: string
    /** Custom onBlur handler (called after field.onBlur) */
    onBlur?: () => void
    /** Callback after value changes — provides setValue to update other fields */
    onAfterChangeValue?: (
        value: any,
        helpers: { setValue: UseFormSetValue<T> }
    ) => void
    /** Simple callback after value changes (no FormProvider needed, used by FilterBar) */
    onValueChange?: (value: any) => void
}

export interface FormFieldTextProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'textfield'
    /** Input type (text, email, password, etc.) */
    inputType?: 'text' | 'email' | 'password' | 'tel' | 'url'
}

export interface FormFieldTextareaProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'textarea'
    /** Number of rows */
    rows?: number
}

export interface FormFieldNumberProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'number'
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step value (only for native number input) */
    step?: number
    /** Enable thousands separator formatting (default: true) */
    formatted?: boolean
    /** Locale for formatting (default: 'en-US' uses comma as thousand separator) */
    locale?: string
    /** Suffix (e.g., 'VND', 'đ') */
    suffix?: string
    /** Prefix (e.g., '$') */
    prefix?: string
    /** Decimal places (default: 0 when formatted) */
    decimals?: number
}

export interface FormFieldSelectProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'select'
    /** Static options (ignored when asyncOptions is provided) */
    options?: SelectOption[]
    /** Allow clearing the selection via hover X icon (single select only) */
    clearable?: boolean
    /** Enable multi-select mode */
    multiple?: boolean
    /** Search placeholder */
    searchPlaceholder?: string
    /** Async function to fetch options (server-side search) — renders AsyncFilterSelect */
    asyncOptions?: (
        query: string,
        page?: number
    ) => Promise<
        | SelectOption[]
        | { options: SelectOption[]; hasMore: boolean; nextPage?: number }
    >
    /** Fetch default option labels for selected values (used with asyncOptions) */
    getDefaultOptions?: (values: any[]) => Promise<SelectOption[]>
    /** Unique query key for async caching */
    queryKey?: string
}

export interface FormFieldCheckboxProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'checkbox'
    /** Description text beside checkbox */
    description?: string
    /** Show bordered box matching filter input height (h-9) */
    bordered?: boolean
}

export interface FormFieldSwitchProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'switch'
    /** Description text beside switch */
    description?: string
    /** Show bordered box matching filter input height (h-9) */
    bordered?: boolean
}

export interface FormFieldDatepickerProps<
    T extends FieldValues,
> extends FormFieldBaseProps<T> {
    type: 'datepicker'
    /** Min date */
    minDate?: Date
    /** Max date */
    maxDate?: Date
    /** Date format for display (default: 'PPP') */
    dateFormat?: string
}

export interface FormFieldDateRangePickerProps<T extends FieldValues> {
    /** react-hook-form control */
    control: Control<T>
    /** Field names for [from, to] dates */
    name: [Path<T>, Path<T>]
    type: 'daterangepicker'
    /** Field label */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Required field indicator */
    required?: boolean
    /** Disabled state */
    disabled?: boolean
    /** Helper text below field */
    helperText?: string
    /** Additional className */
    className?: string
    /** Min date */
    minDate?: Date
    /** Max date */
    maxDate?: Date
    /** Show preset buttons */
    showPresets?: boolean
    /** Number of months to display */
    numberOfMonths?: 1 | 2
    /** Quick end-date presets shown after start date is selected */
    endDatePresets?: import('../date-picker/date-range-picker').EndDatePreset[]
    /** Simple callback after value changes - receives [fromDate, toDate] as YYYY-MM-DD */
    onValueChange?: (value: [string, string]) => void
}

export type FormFieldProps<T extends FieldValues> =
    | FormFieldTextProps<T>
    | FormFieldTextareaProps<T>
    | FormFieldNumberProps<T>
    | FormFieldSelectProps<T>
    | FormFieldCheckboxProps<T>
    | FormFieldSwitchProps<T>
    | FormFieldDatepickerProps<T>
    | FormFieldDateRangePickerProps<T>

export interface FormFieldWrapperProps {
    label?: string
    required?: boolean
    error?: string
    helperText?: string
    className?: string
    children: ReactNode
    /** For checkbox/switch - inline layout */
    inline?: boolean
}

export interface FormFieldHelpModal {
    /** Modal name to open */
    modalName: string
    /** Tooltip title for the help button */
    title?: string
}

export interface FieldRenderProps<T extends FieldValues> {
    field: ControllerRenderProps<T, Path<T>>
    error?: string
}
