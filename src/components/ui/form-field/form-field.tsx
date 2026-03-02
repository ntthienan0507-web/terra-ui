import { Controller, FieldValues, get, useFormContext } from 'react-hook-form'
import { FilterMultiSelect } from '../filters/filter-multi-select'
import { AsyncFilterSelect } from '../filters/async-filter-select'
import { FormFieldDateRange } from './form-field-date-range'
import {
    renderTextField,
    renderTextarea,
    renderNumber,
    renderSelect,
    renderCheckbox,
    renderSwitch,
    renderDatepicker,
    type FieldRenderCtx,
} from './form-field-renderers'
import type { FormFieldProps } from './types'

export function FormField<T extends FieldValues>(props: FormFieldProps<T>) {
    // Get setValue from FormProvider context (null if no provider)
    const formContext = useFormContext<T>()
    const formSetValue = formContext?.setValue

    // Handle daterangepicker separately (uses array of 2 names)
    if (props.type === 'daterangepicker') {
        return <FormFieldDateRange {...props} />
    }

    // Handle select with asyncOptions (server-side search) — AsyncFilterSelect has its own Controller
    if (props.type === 'select' && props.asyncOptions) {
        return (
            <AsyncFilterSelect
                control={props.control}
                name={props.name}
                label={props.label}
                asyncOptions={props.asyncOptions as any}
                getDefaultOptions={props.getDefaultOptions}
                queryKey={props.queryKey}
                multiple={props.multiple}
                placeholder={
                    props.placeholder ? `${props.placeholder}...` : undefined
                }
                searchPlaceholder={props.searchPlaceholder}
                disabled={props.disabled}
            />
        )
    }

    // Handle select multiple (static options) — FilterMultiSelect has its own Controller
    if (props.type === 'select' && props.multiple) {
        return (
            <FilterMultiSelect
                control={props.control}
                name={props.name}
                label={props.label}
                options={props.options || []}
                placeholder={
                    props.placeholder ? `${props.placeholder}...` : undefined
                }
                searchPlaceholder={props.searchPlaceholder}
                disabled={props.disabled}
            />
        )
    }

    const { control, name, onAfterChangeValue, onValueChange } = props

    /** Fire onAfterChangeValue with setValue helper + simple onValueChange */
    const fireAfterChange = (value: any) => {
        if (onAfterChangeValue && formSetValue) {
            onAfterChangeValue(value, { setValue: formSetValue })
        }
        onValueChange?.(value)
    }

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, formState }) => {
                const rawError = get(formState.errors, name)?.message as
                    | string
                    | undefined
                const error = rawError ? (rawError as string) : undefined
                const hasError = !!error

                const handleBlur = () => {
                    field.onBlur()
                    props.onBlur?.()
                }

                const ctx: FieldRenderCtx<T> = {
                    field,
                    error,
                    hasError,
                    handleBlur,
                    fireAfterChange,
                }

                switch (props.type) {
                    case 'textfield':
                        return renderTextField(props, ctx)
                    case 'textarea':
                        return renderTextarea(props, ctx)
                    case 'number':
                        return renderNumber(props, ctx)
                    case 'select':
                        return renderSelect(props, ctx)
                    case 'checkbox':
                        return renderCheckbox(props, ctx)
                    case 'switch':
                        return renderSwitch(props, ctx)
                    case 'datepicker':
                        return renderDatepicker(props, ctx)
                    default:
                        return <></>
                }
            }}
        />
    )
}
