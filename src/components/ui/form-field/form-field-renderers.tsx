import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import dayjs from 'dayjs'
import { cn } from '../../../lib/utils'
import { Input } from '../input'
import { Textarea } from '../textarea'
import { Checkbox } from '../checkbox'
import { Switch } from '../switch'
import { DatePicker } from '../date-picker'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../select'
import { FormFieldWrapper } from './form-field-wrapper'
import { FormattedNumberField } from './formatted-number-field'
import type {
    FormFieldTextProps,
    FormFieldTextareaProps,
    FormFieldNumberProps,
    FormFieldSelectProps,
    FormFieldCheckboxProps,
    FormFieldSwitchProps,
    FormFieldDatepickerProps,
} from './types'

const ERROR_BORDER =
    'border-destructive hover:border-destructive focus-visible:ring-destructive/30'

/** Shared context passed from Controller render to each field renderer */
export interface FieldRenderCtx<T extends FieldValues> {
    field: ControllerRenderProps<T, Path<T>>
    error?: string
    hasError: boolean
    handleBlur: () => void
    fireAfterChange: (value: any) => void
}

export function renderTextField<T extends FieldValues>(
    props: FormFieldTextProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={ctx.error}
            helperText={helperText}
            className={className}
        >
            <Input
                {...ctx.field}
                type={props.inputType || 'text'}
                placeholder={props.placeholder}
                disabled={disabled}
                onBlur={ctx.handleBlur}
                className={cn(ctx.hasError && ERROR_BORDER)}
            />
        </FormFieldWrapper>
    )
}

export function renderTextarea<T extends FieldValues>(
    props: FormFieldTextareaProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={ctx.error}
            helperText={helperText}
            className={className}
        >
            <Textarea
                {...ctx.field}
                placeholder={props.placeholder}
                disabled={disabled}
                rows={props.rows || 3}
                onBlur={ctx.handleBlur}
                className={cn(ctx.hasError && ERROR_BORDER)}
            />
        </FormFieldWrapper>
    )
}

export function renderNumber<T extends FieldValues>(
    props: FormFieldNumberProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    const isFormatted = props.formatted !== false

    if (isFormatted) {
        return (
            <FormattedNumberField
                field={ctx.field}
                label={label}
                required={required}
                error={ctx.error}
                helperText={helperText}
                className={className}
                placeholder={props.placeholder}
                disabled={disabled}
                hasError={ctx.hasError}
                handleBlur={ctx.handleBlur}
                locale={props.locale}
                decimals={props.decimals}
                prefix={props.prefix}
                suffix={props.suffix}
                min={props.min}
                max={props.max}
            />
        )
    }

    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={ctx.error}
            helperText={helperText}
            className={className}
        >
            <Input
                {...ctx.field}
                type="number"
                placeholder={props.placeholder}
                disabled={disabled}
                min={props.min}
                max={props.max}
                step={props.step}
                onBlur={ctx.handleBlur}
                onChange={(e) =>
                    ctx.field.onChange(
                        e.target.value === '' ? '' : Number(e.target.value)
                    )
                }
                className={cn(ctx.hasError && ERROR_BORDER)}
            />
        </FormFieldWrapper>
    )
}

export function renderSelect<T extends FieldValues>(
    props: FormFieldSelectProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    const filteredOptions = props?.options?.filter(
        (o) => o.value !== '' && o.value != null
    )
    const isClearable =
        props.clearable !== false &&
        !!(
            props.clearable ||
            props.options?.some((o) => o.value === '' || o.value == null)
        )
    const hasValue = ctx.field.value != null && ctx.field.value !== ''

    const handleClear = () => {
        ctx.field.onChange('')
        ctx.fireAfterChange('')
    }

    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={ctx.error}
            helperText={helperText}
            className={className}
        >
            <Select
                key={hasValue ? 'v' : 'e'}
                {...(hasValue ? { value: String(ctx.field.value) } : {})}
                onValueChange={(val) => {
                    const opt = filteredOptions?.find(
                        (o) => String(o.value) === val
                    )
                    const newValue = opt?.value ?? val
                    ctx.field.onChange(newValue)
                    ctx.fireAfterChange(newValue)
                }}
                disabled={disabled}
            >
                <SelectTrigger
                    className={cn(ctx.hasError && ERROR_BORDER)}
                    onBlur={ctx.handleBlur}
                    showClear={isClearable && hasValue}
                    onClear={handleClear}
                >
                    <SelectValue
                        placeholder={
                            props.placeholder
                                ? `${props.placeholder}...`
                                : undefined
                        }
                    />
                </SelectTrigger>
                <SelectContent>
                    {filteredOptions?.map((opt) => (
                        <SelectItem
                            key={String(opt.value)}
                            value={String(opt.value)}
                        >
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </FormFieldWrapper>
    )
}

export function renderCheckbox<T extends FieldValues>(
    props: FormFieldCheckboxProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    const bordered = props.bordered

    const handleCheck = (val: boolean) => {
        ctx.field.onChange(val)
        ctx.fireAfterChange(val)
    }

    return (
        <FormFieldWrapper
            label={bordered ? undefined : label}
            required={required}
            error={ctx.error}
            helperText={props.description || helperText}
            className={className}
            inline={!bordered}
        >
            {bordered ? (
                <label
                    className={cn(
                        'flex items-center gap-2 h-9 px-3 rounded-sm border border-input bg-background text-sm cursor-pointer hover:bg-accent/50 transition-colors w-full',
                        ctx.hasError && ERROR_BORDER
                    )}
                >
                    <Checkbox
                        checked={!!ctx.field.value}
                        onCheckedChange={handleCheck}
                        disabled={disabled}
                        onBlur={ctx.handleBlur}
                    />
                    {label && (
                        <span className="whitespace-nowrap select-none text-muted-foreground text-xs">
                            {label}
                        </span>
                    )}
                </label>
            ) : (
                <Checkbox
                    checked={!!ctx.field.value}
                    onCheckedChange={handleCheck}
                    disabled={disabled}
                    onBlur={ctx.handleBlur}
                />
            )}
        </FormFieldWrapper>
    )
}

export function renderSwitch<T extends FieldValues>(
    props: FormFieldSwitchProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    const bordered = props.bordered

    const handleSwitch = (val: boolean) => {
        ctx.field.onChange(val)
        ctx.fireAfterChange(val)
    }

    if (bordered) {
        return (
            <FormFieldWrapper
                error={ctx.error}
                helperText={props.description || helperText}
                className={className}
            >
                <label
                    className={cn(
                        'flex items-center gap-2 h-9 px-3 rounded-sm border border-input bg-background text-sm cursor-pointer hover:bg-accent/50 transition-colors w-full',
                        ctx.hasError &&
                            'border-destructive hover:border-destructive'
                    )}
                >
                    <Switch
                        checked={!!ctx.field.value}
                        onCheckedChange={handleSwitch}
                        disabled={disabled}
                        onBlur={ctx.handleBlur}
                    />
                    {label && (
                        <span className="whitespace-nowrap select-none">
                            {label}
                        </span>
                    )}
                </label>
            </FormFieldWrapper>
        )
    }

    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={ctx.error}
            helperText={props.description || helperText}
            className={className}
            inline
        >
            <Switch
                checked={!!ctx.field.value}
                onCheckedChange={handleSwitch}
                disabled={disabled}
                onBlur={ctx.handleBlur}
            />
        </FormFieldWrapper>
    )
}

export function renderDatepicker<T extends FieldValues>(
    props: FormFieldDatepickerProps<T>,
    ctx: FieldRenderCtx<T>
) {
    const { label, required, helperText, className, disabled } = props
    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={ctx.error}
            helperText={helperText}
            className={className}
        >
            <DatePicker
                value={
                    ctx.field.value
                        ? dayjs(ctx.field.value).toDate()
                        : undefined
                }
                onChange={(date) => {
                    const val = date
                        ? dayjs(date).format('YYYY-MM-DD')
                        : undefined
                    ctx.field.onChange(val)
                    ctx.fireAfterChange(val)
                }}
                placeholder={props.placeholder}
                disabled={disabled}
                className={cn(
                    'w-full',
                    ctx.hasError &&
                        'border-destructive hover:border-destructive hover:bg-background focus-visible:ring-destructive/30'
                )}
                calendarProps={{
                    disabled: (date) => {
                        if (props.minDate && date < props.minDate) return true
                        if (props.maxDate && date > props.maxDate) return true
                        return false
                    },
                }}
            />
        </FormFieldWrapper>
    )
}
