import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import dayjs from 'dayjs'

import {
    DatePicker,
    SimpleDateRangePicker,
    DateRangePicker,
    DateInput,
    Calendar,
    DEFAULT_PRESETS,
} from '../index'
import type { DateRange, EndDatePreset } from '../index'

// =============================================================================
// DatePicker (Single Date)
// =============================================================================

const datePickerMeta: Meta<typeof DatePicker> = {
    title: 'DatePicker/Single',
    component: DatePicker,
    parameters: { layout: 'centered' },
}

export default datePickerMeta
type Story = StoryObj<typeof DatePicker>

export const Basic: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>()
        return (
            <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Pick a date"
            />
        )
    },
}

export const WithDefaultValue: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>(new Date())
        return <DatePicker value={date} onChange={setDate} />
    },
}

export const Disabled: Story = {
    render: () => {
        return (
            <DatePicker
                value={new Date()}
                disabled
                placeholder="Disabled"
            />
        )
    },
}

// =============================================================================
// SimpleDateRangePicker
// =============================================================================

export const SimpleRange: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        return (
            <SimpleDateRangePicker
                value={range}
                onChange={setRange as any}
                placeholder="Pick a date range"
            />
        )
    },
}

export const SimpleRangeWithValue: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>({
            from: dayjs().subtract(7, 'day').toDate(),
            to: new Date(),
        })
        return (
            <SimpleDateRangePicker
                value={range}
                onChange={setRange as any}
            />
        )
    },
}

// =============================================================================
// DateRangePicker (Full-featured with presets)
// =============================================================================

export const FullDateRangePicker: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        return (
            <div className="w-[300px]">
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                    placeholder="Select date range"
                />
            </div>
        )
    },
}

export const WithPresets: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        return (
            <div className="w-[300px]">
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                    presets={DEFAULT_PRESETS}
                    placeholder="Select date range"
                />
            </div>
        )
    },
}

export const WithCustomPresets: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        const customPresets = [
            { name: 'today', label: 'Today' },
            { name: 'yesterday', label: 'Yesterday' },
            { name: 'last7', label: 'Last 7 days' },
            { name: 'last30', label: 'Last 30 days' },
            { name: 'thisMonth', label: 'This month' },
        ]
        return (
            <div className="w-[300px]">
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                    presets={customPresets}
                />
            </div>
        )
    },
}

export const WithMinMaxDate: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        return (
            <div className="w-[300px]">
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                    presets={DEFAULT_PRESETS}
                    minDate={dayjs().subtract(30, 'day').toDate()}
                    maxDate={new Date()}
                    placeholder="Last 30 days only"
                />
            </div>
        )
    },
}

export const SingleMonth: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        return (
            <div className="w-[300px]">
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                    numberOfMonths={1}
                    placeholder="Single month view"
                />
            </div>
        )
    },
}

export const WithEndDatePresets: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>()
        const endDatePresets: EndDatePreset[] = [
            {
                name: '7days',
                label: '+7 days',
                getEndDate: (start) => start.add(7, 'day').toDate(),
            },
            {
                name: '14days',
                label: '+14 days',
                getEndDate: (start) => start.add(14, 'day').toDate(),
            },
            {
                name: '30days',
                label: '+30 days',
                getEndDate: (start) => start.add(30, 'day').toDate(),
            },
            {
                name: '3months',
                label: '+3 months',
                getEndDate: (start) => start.add(3, 'month').toDate(),
            },
        ]
        return (
            <div className="w-[300px]">
                <DateRangePicker
                    value={range}
                    onChange={setRange}
                    endDatePresets={endDatePresets}
                    placeholder="Select start, then pick duration"
                />
            </div>
        )
    },
}

// =============================================================================
// DateInput
// =============================================================================

export const DateInputBasic: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date>(new Date())
        return (
            <div className="w-[200px]">
                <DateInput value={date} onChange={setDate} />
            </div>
        )
    },
}

// =============================================================================
// Calendar
// =============================================================================

export const CalendarSingle: Story = {
    render: () => {
        const [date, setDate] = React.useState<Date | undefined>(new Date())
        return (
            <Calendar
                {...({
                    mode: 'single',
                    selected: date,
                    onSelect: setDate,
                } as any)}
            />
        )
    },
}

export const CalendarRange: Story = {
    render: () => {
        const [range, setRange] = React.useState<DateRange | undefined>({
            from: dayjs().subtract(3, 'day').toDate(),
            to: new Date(),
        })
        return (
            <Calendar
                {...({
                    mode: 'range',
                    selected: range,
                    onSelect: setRange,
                    numberOfMonths: 2,
                } as any)}
            />
        )
    },
}
