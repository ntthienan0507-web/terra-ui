import { useState, useEffect, useRef } from 'react'
import { cn } from '../../../lib/utils'
import { Input } from '../input'
import { FormFieldWrapper } from './form-field-wrapper'

export interface FormattedNumberFieldProps {
    field: { value: any; onChange: (val: any) => void; onBlur: () => void }
    label?: string
    required?: boolean
    error?: string
    helperText?: string
    className?: string
    placeholder?: string
    disabled?: boolean
    hasError: boolean
    handleBlur: () => void
    locale?: string
    decimals?: number
    prefix?: string
    suffix?: string
    min?: number
    max?: number
}

/** Formatted number input with thousands separator - formats live while typing */
export function FormattedNumberField({
    field,
    label,
    required,
    error,
    helperText,
    className,
    placeholder,
    disabled,
    hasError,
    handleBlur,
    decimals = 0,
    prefix = '',
    suffix = '',
    min,
    max,
}: FormattedNumberFieldProps) {
    // Format number with thousands separator (keeps trailing dot/zeros for typing)
    const formatForDisplay = (val: string): string => {
        if (!val) return ''

        // Remove existing commas, keep digits, dot, minus
        const cleaned = val.replace(/,/g, '')

        // Check if has decimal point
        const hasDecimal = cleaned.includes('.')
        const parts = cleaned.split('.')
        const integerPart = parts[0] || ''
        const decimalPart = parts[1] ?? ''

        // Format integer part with commas
        const formattedInteger = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ','
        )

        // Rebuild with decimal if present
        if (hasDecimal) {
            return `${formattedInteger}.${decimalPart}`
        }
        return formattedInteger
    }

    // Parse string to number
    const parseValue = (val: string): number | null => {
        if (!val) return null
        const cleaned = val.replace(/,/g, '').replace(/[^\d.\-]/g, '')
        if (!cleaned || cleaned === '-' || cleaned === '.') return null
        const num = parseFloat(cleaned)
        if (isNaN(num)) return null
        return num
    }

    // Local state for display
    const [inputValue, setInputValue] = useState(() => {
        if (
            field.value === null ||
            field.value === undefined ||
            field.value === ''
        )
            return ''
        return formatForDisplay(String(field.value))
    })
    const isFocusedRef = useRef(false)

    // Sync with external value changes (only when not focused to avoid cursor jump)
    useEffect(() => {
        if (isFocusedRef.current) {
            return
        }

        if (
            field.value === null ||
            field.value === undefined ||
            field.value === ''
        ) {
            setInputValue('')
        } else {
            const formatted = formatForDisplay(String(field.value))
            setInputValue(formatted)
        }
    }, [field.value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value

        // Only allow: digits, comma, dot, minus
        const filtered = rawValue.replace(/[^\d,.\-]/g, '')

        // Limit decimal places
        const parts = filtered.replace(/,/g, '').split('.')
        let limitedValue = filtered
        if (parts.length > 1 && decimals >= 0) {
            const intPart = parts[0]
            const decPart = parts
                .slice(1)
                .join('')
                .slice(0, decimals || 10)
            limitedValue = `${intPart}.${decPart}`
        }

        // Format and display
        const formatted = formatForDisplay(limitedValue)
        setInputValue(formatted)

        // Parse and update form value
        const parsed = parseValue(formatted)
        if (parsed !== null) {
            let finalValue = parsed
            if (min !== undefined && parsed < min) finalValue = min
            if (max !== undefined && parsed > max) finalValue = max
            field.onChange(finalValue)
        } else if (filtered === '') {
            field.onChange('')
        }
    }

    const handleFocus = () => {
        isFocusedRef.current = true
    }

    const handleInputBlur = () => {
        isFocusedRef.current = false
        // Clean up trailing dot on blur and reformat from field.value
        if (
            field.value === null ||
            field.value === undefined ||
            field.value === ''
        ) {
            setInputValue('')
        } else {
            const formatted = formatForDisplay(String(field.value))
            setInputValue(formatted)
        }
        handleBlur()
    }

    return (
        <FormFieldWrapper
            label={label}
            required={required}
            error={error}
            helperText={helperText}
            className={className}
        >
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {prefix}
                    </span>
                )}
                <Input
                    type="text"
                    inputMode="decimal"
                    value={inputValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={handleFocus}
                    onBlur={handleInputBlur}
                    onChange={handleChange}
                    className={cn(
                        prefix && 'pl-7',
                        suffix && 'pr-12',
                        hasError &&
                            'border-destructive hover:border-destructive focus-visible:ring-destructive/30'
                    )}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        {suffix}
                    </span>
                )}
            </div>
        </FormFieldWrapper>
    )
}
