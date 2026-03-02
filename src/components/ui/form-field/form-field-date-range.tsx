import { Controller, FieldValues, get, useWatch } from 'react-hook-form'
import dayjs from 'dayjs'
import { cn } from '../../../lib/utils'
import { DateRangePicker } from '../date-picker'
import { FormFieldWrapper } from './form-field-wrapper'
import type { FormFieldDateRangePickerProps } from './types'

/** Separate component for daterangepicker with 2 names */
export function FormFieldDateRange<T extends FieldValues>(
    props: FormFieldDateRangePickerProps<T>
) {
    const {
        control,
        name,
        label,
        required,
        disabled,
        helperText,
        className,
        minDate,
        maxDate,
        showPresets,
        numberOfMonths,
        placeholder,
        endDatePresets,
        onValueChange,
    } = props

    const [fromName, toName] = name
    const fromValue = useWatch({ control, name: fromName })
    const toValue = useWatch({ control, name: toName })

    return (
        <Controller
            control={control}
            name={fromName}
            render={({ field: fromField, formState }) => (
                <Controller
                    control={control}
                    name={toName}
                    render={({ field: toField }) => {
                        const rawError =
                            get(formState.errors, fromName)?.message ||
                            get(formState.errors, toName)?.message
                        const error = rawError
                            ? (rawError as string)
                            : undefined
                        const hasError = !!error

                        // Parse safely — guard against invalid date strings
                        const parseDate = (v: unknown): Date | undefined => {
                            if (!v) return undefined
                            const d = new Date(v as string | number | Date)
                            return isNaN(d.getTime()) ? undefined : d
                        }

                        const parsedFrom = parseDate(fromValue)
                        const value = parsedFrom
                            ? { from: parsedFrom, to: parseDate(toValue) }
                            : undefined

                        const handleChange = (
                            range: { from: Date; to?: Date } | undefined
                        ) => {
                            if (range?.from !== undefined) {
                                fromField.onChange(
                                    dayjs(range.from).format('YYYY-MM-DD')
                                )
                            }
                            if (range?.to !== undefined) {
                                toField.onChange(
                                    dayjs(range.to).format('YYYY-MM-DD')
                                )
                            } else if (range === undefined) {
                                fromField.onChange(null)
                                toField.onChange(null)
                            }
                            // Fire onValueChange when both dates are selected
                            if (range?.from && range?.to) {
                                onValueChange?.([
                                    dayjs(range.from).format('YYYY-MM-DD'),
                                    dayjs(range.to).format('YYYY-MM-DD'),
                                ])
                            }
                        }

                        return (
                            <FormFieldWrapper
                                label={label}
                                required={required}
                                error={error}
                                helperText={helperText}
                                className={className}
                            >
                                <DateRangePicker
                                    value={value}
                                    onChange={handleChange}
                                    placeholder={placeholder}
                                    disabled={disabled}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    showPresets={showPresets}
                                    numberOfMonths={numberOfMonths}
                                    endDatePresets={endDatePresets}
                                    className={cn(
                                        hasError &&
                                            'border-destructive hover:border-destructive hover:bg-background focus-visible:ring-destructive/30'
                                    )}
                                />
                            </FormFieldWrapper>
                        )
                    }}
                />
            )}
        />
    )
}
