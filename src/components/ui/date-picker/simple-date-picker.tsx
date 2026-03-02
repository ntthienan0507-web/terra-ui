'use client'

import * as React from 'react'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { cn } from '../../../lib/utils'
import { Button } from '../button'
import { Calendar } from './calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../popover'

export interface DatePickerProps {
    value?: Date
    onChange?: (date: Date | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    calendarProps?: React.ComponentProps<typeof Calendar>
}

function DatePicker({
    value,
    onChange,
    placeholder = 'Pick a date',
    disabled = false,
    className,
    calendarProps,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                        dayjs(value).format('DD/MM/YYYY')
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-sm" align="start">
                <Calendar
                    {...({
                        mode: 'single',
                        selected: value,
                        onSelect: (date: Date | undefined) => {
                            onChange?.(date)
                            setOpen(false)
                        },
                    } as any)}
                    autoFocus
                    {...calendarProps}
                />
            </PopoverContent>
        </Popover>
    )
}

export interface SimpleDateRangePickerProps {
    value?: DateRange
    onChange?: (range: DateRange | undefined) => void
    placeholder?: string
    disabled?: boolean
    className?: string
    calendarProps?: Omit<
        React.ComponentProps<typeof Calendar>,
        'mode' | 'selected' | 'onSelect'
    >
}

function SimpleDateRangePicker({
    value,
    onChange,
    placeholder = 'Pick a date range',
    disabled = false,
    className,
    calendarProps,
}: SimpleDateRangePickerProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        'w-[300px] justify-start text-left font-normal',
                        !value?.from && 'text-muted-foreground',
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value?.from ? (
                        value.to ? (
                            <>
                                {dayjs(value.from).format('DD/MM/YYYY')} -{' '}
                                {dayjs(value.to).format('DD/MM/YYYY')}
                            </>
                        ) : (
                            dayjs(value.from).format('DD/MM/YYYY')
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-sm" align="start">
                <Calendar
                    mode="range"
                    defaultMonth={value?.from}
                    selected={value as any}
                    onSelect={((range: DateRange | undefined) =>
                        onChange?.(range)
                    ) as any}
                    numberOfMonths={2}
                    {...(calendarProps as any)}
                />
            </PopoverContent>
        </Popover>
    )
}

export { DatePicker, SimpleDateRangePicker }
