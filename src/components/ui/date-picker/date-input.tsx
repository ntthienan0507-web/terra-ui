'use client'

import * as React from 'react'
import { cn } from '../../../lib/utils'

interface DateInputProps {
    value?: Date
    onChange: (date: Date) => void
    disabled?: boolean
    className?: string
}

interface DateParts {
    day: string
    month: string
    year: string
}

function formatDateParts(d: Date): DateParts {
    return {
        day: d.getDate().toString().padStart(2, '0'),
        month: (d.getMonth() + 1).toString().padStart(2, '0'),
        year: d.getFullYear().toString(),
    }
}

/**
 * DateInput - Inline date input with separate month/day/year fields
 * Supports keyboard navigation (Arrow Up/Down to increment/decrement)
 */
function DateInput({ value, onChange, disabled, className }: DateInputProps) {
    const [inputValues, setInputValues] = React.useState<DateParts>(() => {
        const d = value ? new Date(value) : new Date()
        return formatDateParts(d)
    })

    const monthRef = React.useRef<HTMLInputElement>(null)
    const dayRef = React.useRef<HTMLInputElement>(null)
    const yearRef = React.useRef<HTMLInputElement>(null)
    const initialValues = React.useRef<DateParts>(inputValues)

    // Sync with external value - use serialized string for stable comparison
    const valueKey = value
        ? `${value.getFullYear()}-${value.getMonth()}-${value.getDate()}`
        : ''
    React.useEffect(() => {
        if (value) {
            const newValues = formatDateParts(new Date(value))
            setInputValues(newValues)
            initialValues.current = newValues
        }
    }, [valueKey])

    const validateAndGetDate = (parts: DateParts): Date | null => {
        const day = parseInt(parts.day, 10)
        const month = parseInt(parts.month, 10)
        const year = parseInt(parts.year, 10)

        if (isNaN(day) || isNaN(month) || isNaN(year)) return null
        if (
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1000 ||
            year > 9999
        )
            return null

        const d = new Date(year, month - 1, day)
        if (
            d.getFullYear() !== year ||
            d.getMonth() + 1 !== month ||
            d.getDate() !== day
        )
            return null

        return d
    }

    const handleInputChange =
        (field: keyof DateParts) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/\D/g, '') // Only digits
            setInputValues((prev) => ({ ...prev, [field]: val }))
        }

    const handleBlur = (_field: keyof DateParts) => () => {
        const newParts = { ...inputValues }
        const validDate = validateAndGetDate(newParts)

        if (validDate) {
            const formatted = formatDateParts(validDate)
            setInputValues(formatted)
            initialValues.current = formatted
            onChange(validDate)
        } else {
            // Reset to last valid state
            setInputValues(initialValues.current)
        }
    }

    const handleKeyDown =
        (field: keyof DateParts) =>
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.metaKey || e.ctrlKey) return

            const allowedKeys = [
                'ArrowUp',
                'ArrowDown',
                'ArrowLeft',
                'ArrowRight',
                'Delete',
                'Tab',
                'Backspace',
                'Enter',
            ]
            if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault()
                return
            }

            // Arrow up/down to increment/decrement
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault()
                const currentDate = validateAndGetDate(inputValues)
                if (!currentDate) return

                const delta = e.key === 'ArrowUp' ? 1 : -1
                const newDate = new Date(currentDate)

                if (field === 'day') newDate.setDate(newDate.getDate() + delta)
                else if (field === 'month')
                    newDate.setMonth(newDate.getMonth() + delta)
                else if (field === 'year')
                    newDate.setFullYear(newDate.getFullYear() + delta)

                const formatted = formatDateParts(newDate)
                setInputValues(formatted)
                initialValues.current = formatted
                onChange(newDate)
            }

            // Navigate between fields
            if (e.key === 'ArrowRight') {
                const isAtEnd =
                    e.currentTarget.selectionStart ===
                    e.currentTarget.value.length
                if (isAtEnd) {
                    e.preventDefault()
                    if (field === 'day') monthRef.current?.focus()
                    if (field === 'month') yearRef.current?.focus()
                }
            } else if (e.key === 'ArrowLeft') {
                const isAtStart = e.currentTarget.selectionStart === 0
                if (isAtStart) {
                    e.preventDefault()
                    if (field === 'month') dayRef.current?.focus()
                    if (field === 'year') monthRef.current?.focus()
                }
            }
        }

    const inputClass =
        'p-0 outline-none border-none text-center bg-transparent focus:ring-0'

    return (
        <div
            className={cn(
                'flex w-full items-center justify-center rounded-sm border bg-background px-2 py-1.5 text-sm',
                disabled && 'opacity-50 pointer-events-none',
                className
            )}
        >
            <input
                type="text"
                ref={dayRef}
                maxLength={2}
                value={inputValues.day}
                onChange={handleInputChange('day')}
                onKeyDown={handleKeyDown('day')}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur('day')}
                disabled={disabled}
                className={cn(inputClass, 'w-6')}
                placeholder="DD"
            />
            <span className="opacity-30 mx-0.5">/</span>
            <input
                type="text"
                ref={monthRef}
                maxLength={2}
                value={inputValues.month}
                onChange={handleInputChange('month')}
                onKeyDown={handleKeyDown('month')}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur('month')}
                disabled={disabled}
                className={cn(inputClass, 'w-6')}
                placeholder="MM"
            />
            <span className="opacity-30 mx-0.5">/</span>
            <input
                type="text"
                ref={yearRef}
                maxLength={4}
                value={inputValues.year}
                onChange={handleInputChange('year')}
                onKeyDown={handleKeyDown('year')}
                onFocus={(e) => e.target.select()}
                onBlur={handleBlur('year')}
                disabled={disabled}
                className={cn(inputClass, 'w-10')}
                placeholder="YYYY"
            />
        </div>
    )
}

export { DateInput }
export type { DateInputProps }
