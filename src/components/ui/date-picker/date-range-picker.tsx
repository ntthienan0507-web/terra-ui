'use client'

import dayjs from 'dayjs'
import { CalendarIcon, CheckIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '../button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../popover'
import { cn } from '../../../lib/utils'
import { Calendar } from './calendar'
import { DateInput } from './date-input'
import {
    DEFAULT_PRESETS,
    detectPreset,
    filterPresetsByDateBounds,
    getPresetRange,
} from './date-range-presets'
import type { DateRange, EndDatePreset, Preset } from './date-range-presets'

// Re-export types & constants for consumers
export { DEFAULT_PRESETS }
export type { DateRange, EndDatePreset, Preset }

// ============================================================================
// Props
// ============================================================================

export interface DateRangePickerProps {
    /** Current date range value */
    value?: DateRange
    /** Callback when date range changes */
    onChange?: (range: DateRange | undefined) => void
    /** Placeholder text when no date selected */
    placeholder?: string
    /** Disable the picker */
    disabled?: boolean
    /** Additional className for trigger button */
    className?: string
    /** Popover alignment */
    align?: 'start' | 'center' | 'end'
    /**
     * Custom presets to show. Pass array of preset names or custom presets.
     * Use DEFAULT_PRESETS for built-in presets.
     * If not provided or empty, presets panel is hidden.
     */
    presets?: Preset[]
    /** @deprecated Use `presets` prop instead. Show default preset buttons */
    showPresets?: boolean
    /** Locale for date formatting */
    locale?: string
    /** Minimum selectable date */
    minDate?: Date
    /** Maximum selectable date */
    maxDate?: Date
    /** Number of months to display */
    numberOfMonths?: 1 | 2
    /** Quick end-date presets shown after start date is selected */
    endDatePresets?: EndDatePreset[]
}

// ============================================================================
// Component
// ============================================================================

function DateRangePicker({
    value,
    onChange,
    placeholder = 'Select date range',
    disabled = false,
    className,
    align = 'start',
    presets,
    showPresets = false,
    minDate,
    maxDate,
    numberOfMonths = 2,
    endDatePresets,
}: DateRangePickerProps) {
    // Determine which presets to show, filtered by min/max date bounds
    const activePresets = React.useMemo(() => {
        const base = presets ?? (showPresets ? DEFAULT_PRESETS : [])
        return filterPresetsByDateBounds(base, minDate, maxDate)
    }, [presets, showPresets, maxDate, minDate])

    const [open, setOpen] = React.useState(false)
    const [range, setRange] = React.useState<DateRange | undefined>(value)
    const [selectedPreset, setSelectedPreset] = React.useState<
        string | undefined
    >(value ? detectPreset(value, activePresets) : undefined)

    // Controlled calendar month — jumps when preset or value changes
    const getInitialMonth = (r?: DateRange) =>
        r?.from ??
        new Date(
            new Date().setMonth(new Date().getMonth() - (numberOfMonths - 1))
        )
    const [displayMonth, setDisplayMonth] = React.useState<Date>(
        getInitialMonth(value)
    )

    // Sync with external value when popover opens
    React.useEffect(() => {
        if (open) {
            setRange(value)
            setDisplayMonth(getInitialMonth(value))
        }
    }, [open])

    // Auto-detect matching preset whenever range changes
    React.useEffect(() => {
        if (range?.from && range?.to && activePresets.length > 0) {
            setSelectedPreset(detectPreset(range, activePresets))
        } else {
            setSelectedPreset(undefined)
        }
    }, [range, activePresets])

    const handlePresetClick = (presetName: string) => {
        const presetRange = getPresetRange(presetName)
        setRange(presetRange)
        setSelectedPreset(presetName)
        // Jump calendar view to show the preset's start month
        setDisplayMonth(presetRange.from)
    }

    const handleCalendarSelect = (
        selected: { from?: Date; to?: Date } | undefined,
        triggerDate: Date
    ) => {
        if (!triggerDate) return

        // When both from & to exist, start a new selection from scratch
        if (range?.from && range?.to) {
            setRange({ from: triggerDate, to: undefined })
            return
        }

        // Otherwise let react-day-picker handle the range logic
        if (selected?.from) {
            setRange({ from: selected.from, to: selected.to })
        } else {
            setRange(undefined)
        }
    }

    const handleFromChange = (date: Date) => {
        const toDate = range?.to && date > range.to ? date : range?.to
        setRange({ from: date, to: toDate })
    }

    const handleToChange = (date: Date) => {
        const fromDate = range?.from && date < range.from ? date : range?.from
        setRange({ from: fromDate || date, to: date })
    }

    const handleCancel = () => {
        setRange(value)
        setOpen(false)
    }

    const handleApply = () => {
        onChange?.(range)
        setOpen(false)
    }

    const formatDisplayDate = () => {
        if (!range?.from) return placeholder
        if (!range.to) return dayjs(range.from).format('DD/MM/YYYY')
        return `${dayjs(range.from).format('DD/MM/YYYY')} - ${dayjs(range.to).format('DD/MM/YYYY')}`
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-full justify-start text-left font-normal gap-2',
                        !value?.from && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="h-3 w-3 shrink-0 text-muted-foreground/50" />
                    <span
                        className={`${value?.from ? '' : 'text-muted-foreground/50 text-xs italic text-nowrap text-gray-400'}`}
                    >
                        {formatDisplayDate()}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-auto p-0 rounded-sm animate-none"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex">
                    {/* Calendar Section */}
                    <div className="flex flex-col p-3">
                        {/* Date Inputs */}
                        <div className="flex items-center gap-2 pb-3">
                            <DateInput
                                value={range?.from}
                                onChange={handleFromChange}
                                disabled={disabled}
                            />
                            <span className="text-muted-foreground">-</span>
                            <DateInput
                                value={range?.to}
                                onChange={handleToChange}
                                disabled={disabled}
                            />
                        </div>

                        {/* End-date quick presets */}
                        {endDatePresets &&
                            endDatePresets.length > 0 &&
                            range?.from && (
                                <div className="flex flex-wrap gap-1.5 pb-3">
                                    {endDatePresets.map((preset) => {
                                        const presetEnd = preset.getEndDate(
                                            dayjs(range.from)
                                        )
                                        const isActive =
                                            range?.to &&
                                            dayjs(range.to).isSame(
                                                dayjs(presetEnd),
                                                'day'
                                            )
                                        return (
                                            <Button
                                                key={preset.name}
                                                variant={
                                                    isActive
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                size="sm"
                                                className="h-7 text-xs rounded-full"
                                                onClick={() => {
                                                    setRange({
                                                        from: range.from,
                                                        to: presetEnd,
                                                    })
                                                }}
                                            >
                                                {preset.label}
                                            </Button>
                                        )
                                    })}
                                </div>
                            )}

                        {/* Calendar */}
                        <Calendar
                            mode="range"
                            selected={range}
                            showOutsideDays={false}
                            onSelect={(selected, triggerDate) =>
                                handleCalendarSelect(selected, triggerDate)
                            }
                            numberOfMonths={numberOfMonths}
                            month={displayMonth}
                            onMonthChange={setDisplayMonth}
                            disabled={(date) => {
                                if (minDate && date < minDate) return true
                                if (maxDate && date > maxDate) return true
                                return false
                            }}
                        />
                    </div>

                    {/* Presets Section */}
                    {activePresets.length > 0 && (
                        <div className="flex flex-col gap-1 border-l p-3 min-w-[160px] max-h-[380px] overflow-y-auto">
                            {activePresets.map((preset) => (
                                <Button
                                    key={preset.name}
                                    variant="ghost"
                                    className={cn(
                                        'justify-start rounded-sm min-w-0 h-9 px-3 text-sm font-normal',
                                        selectedPreset === preset.name &&
                                            'bg-primary/10 text-primary'
                                    )}
                                    onClick={() =>
                                        handlePresetClick(preset.name)
                                    }
                                >
                                    <CheckIcon
                                        className={cn(
                                            'mr-2 h-4 w-4 shrink-0',
                                            selectedPreset === preset.name
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                    {preset.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t p-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-sm min-w-0"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        className="rounded-sm min-w-0"
                        onClick={handleApply}
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { DateRangePicker }
