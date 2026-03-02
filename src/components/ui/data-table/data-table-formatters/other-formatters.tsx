import type { ReactNode } from 'react'
import { Check, X } from 'lucide-react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../badge'
import { Checkbox } from '../../checkbox'
import type {
    NumberFormatterConfig,
    CurrencyFormatterConfig,
    BadgeFormatterConfig,
    BooleanFormatterConfig,
    AvatarFormatterConfig,
    TimeRangeFormatterConfig,
    OptionsFormatterConfig,
} from './types'
import { renderChipFormatter } from './chip-formatter'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Render number formatter
 */
export function renderNumberFormatter(
    value: any,
    _row: any,
    config: NumberFormatterConfig
): ReactNode {
    if (value === null || value === undefined) return null

    const {
        decimals = 0,
        thousandSeparator = ',',
        decimalSeparator = '.',
        prefix,
        suffix,
        className,
    } = config

    const num = Number(value)
    if (isNaN(num)) return String(value)

    // Format number
    const parts = num.toFixed(decimals).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    const formatted = parts.join(decimalSeparator)

    return (
        <span className={className}>
            {prefix}
            {formatted}
            {suffix}
        </span>
    )
}

/**
 * Render currency formatter
 */
export function renderCurrencyFormatter(
    value: any,
    _row: any,
    config: CurrencyFormatterConfig
): ReactNode {
    const {
        currency,
        position = 'suffix',
        decimals,
        thousandSeparator = ',',
        decimalSeparator = '.',
        className,
        hideZero = false,
    } = config

    if (value === null || value === undefined) return null

    const num = Number(value)
    if (isNaN(num)) return String(value)

    // Hide zero if configured
    if (hideZero && num === 0) return '-'

    // Auto-detect decimals: VND = 0, others = 2
    const finalDecimals =
        decimals !== undefined
            ? decimals
            : currency === 'VND' || currency === '₫'
              ? 0
              : 2

    // Format number
    const parts = num.toFixed(finalDecimals).split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    const formatted = parts.join(decimalSeparator)

    // Build currency string
    const currencyStr =
        position === 'prefix'
            ? `${currency}${formatted}`
            : `${formatted} ${currency}`

    return <span className={cn('', className)}>{currencyStr}</span>
}

/**
 * Render badge formatter
 */
export function renderBadgeFormatter(
    value: any,
    _row: any,
    config: BadgeFormatterConfig
): ReactNode {
    const { variant = 'default', showZero = false } = config

    const num = Number(value)
    if (!showZero && num === 0) return null

    return <Badge variant={variant as any}>{value}</Badge>
}

/**
 * Render boolean formatter
 */
export function renderBooleanFormatter(
    value: any,
    _row: any,
    config: BooleanFormatterConfig
): ReactNode {
    const {
        display = 'checkbox',
        trueLabel = 'Yes',
        falseLabel = 'No',
        trueIcon = <Check className="w-4 h-4 text-green-600" />,
        falseIcon = <X className="w-4 h-4 text-red-600" />,
    } = config

    const boolValue = Boolean(value)

    if (display === 'checkbox') {
        return <Checkbox checked={boolValue} disabled />
    }

    if (display === 'icon') {
        return boolValue ? trueIcon : falseIcon
    }

    // text mode
    return <span>{boolValue ? trueLabel : falseLabel}</span>
}

/**
 * Render avatar formatter
 */
export function renderAvatarFormatter<T = any>(
    value: any,
    row: T,
    config: AvatarFormatterConfig
): ReactNode {
    const { imageKey, fallback = 'initials', size = 'md' } = config

    const imageUrl = imageKey ? (row as any)[imageKey] : null
    const name = String(value || '')

    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
    }

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                className={cn('rounded-full object-cover', sizeClasses[size])}
            />
        )
    }

    if (fallback === 'initials') {
        const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

        return (
            <div
                className={cn(
                    'flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium',
                    sizeClasses[size]
                )}
            >
                {initials}
            </div>
        )
    }

    return null
}

/**
 * TimeRange Formatter
 * Formats a time range from two separate row values (start and end)
 */
export function renderTimeRangeFormatter<T = any>(
    _value: any,
    row: T,
    config: TimeRangeFormatterConfig
): ReactNode {
    const {
        startKey,
        endKey,
        format = 'HH:mm',
        startFormat,
        endFormat,
        separator = ' - ',
        className,
        emptyPlaceholder = '-',
        timezone: tz = 'local',
        smartYear = false,
    } = config

    const startValue = (row as any)[startKey]
    const endValue = (row as any)[endKey]

    // Both empty
    if (!startValue && !endValue) {
        return <span className={className}>{emptyPlaceholder}</span>
    }

    // Format times
    let finalStartFormat = startFormat || format
    const finalEndFormat = endFormat || format

    // Helper to parse date with timezone handling
    const parseDate = (value: any): dayjs.Dayjs | null => {
        if (!value) return null

        // If value is already a simple time string (HH:mm format), can't parse year
        if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            return null
        }

        // Parse with timezone handling
        let parsed: dayjs.Dayjs

        if (tz === 'utc') {
            parsed = dayjs.utc(value)
        } else if (tz === 'local') {
            parsed = dayjs(value)
        } else {
            parsed = dayjs(value).tz(tz)
        }

        return parsed.isValid() ? parsed : null
    }

    // Smart year handling - remove year from start if same as end year
    if (smartYear && startValue && endValue) {
        const startDate = parseDate(startValue)
        const endDate = parseDate(endValue)

        if (startDate && endDate && startDate.year() === endDate.year()) {
            // Remove year tokens from start format
            finalStartFormat = finalStartFormat
                .replace(/YYYY/g, '')
                .replace(/YY/g, '')
                // Clean up trailing/leading separators
                .replace(/^[\s\/\-\.]+|[\s\/\-\.]+$/g, '')
                // Clean up double separators
                .replace(/[\s\/\-\.]{2,}/g, (match) => match[0])
        }
    }

    // Helper to format time - handles both datetime strings and plain time strings
    const formatTime = (value: any, formatStr: string): string => {
        if (!value) return ''

        // If value is already a simple time string (HH:mm format), return as-is
        if (typeof value === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
            return value
        }

        const parsed = parseDate(value)
        return parsed ? parsed.format(formatStr) : String(value)
    }

    const formattedStart = formatTime(startValue, finalStartFormat)
    const formattedEnd = formatTime(endValue, finalEndFormat)

    // Handle cases where only one is available
    if (!startValue && endValue) {
        return <span className={className}>{formattedEnd}</span>
    }
    if (startValue && !endValue) {
        return <span className={className}>{formattedStart}</span>
    }

    return (
        <span className={className}>
            {formattedStart}
            {separator}
            {formattedEnd}
        </span>
    )
}

/**
 * Options Formatter
 * Maps values to labels/colors from an options array
 * Simplified interface for common use cases like status, payment methods, etc.
 */
export function renderOptionsFormatter<T = any>(
    value: any,
    row: T,
    config: OptionsFormatterConfig
): ReactNode {
    const {
        options,
        fallbackValue,
        renderMode = 'chip',
        size = 'sm',
        showDot = false,
        className,
        variant = 'chip',
        textTransform = 'none',
    } = config

    // If no value, return fallback or dash
    if (value === null || value === undefined) {
        return fallbackValue || '-'
    }

    // Find matching option
    const matchedOption = options.find((opt) => opt.value === value)

    // If no match, show fallback or raw value
    if (!matchedOption) {
        return fallbackValue || String(value)
    }

    // Text transform class
    const transformClass = {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
        none: '',
    }[textTransform]

    // Render as plain text
    if (renderMode === 'text') {
        return (
            <span className={cn(transformClass, className)}>
                {matchedOption.label}
            </span>
        )
    }

    // Render as chip - Convert options array to colorMap for chip formatter
    const colorMap = options.reduce(
        (acc, opt) => {
            acc[String(opt.value)] = {
                label: opt.label,
                color: opt.color || 'default',
                icon: opt.icon,
            }
            return acc
        },
        {} as Record<string | number, any>
    )

    // Use existing chip formatter with converted config
    return renderChipFormatter(value, row, {
        type: 'chip',
        colorMap,
        size,
        showDot,
        className,
        variant,
        textTransform,
    })
}
