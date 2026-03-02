import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from 'lucide-react'
import * as React from 'react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { Button, buttonVariants } from '../button'
import { cn } from '../../../lib/utils'

function Calendar({
    className,
    classNames,
    showOutsideDays = false,
    captionLayout = 'label',
    buttonVariant = 'ghost',
    formatters,
    components,
    ...props
}: React.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
    const defaultClassNames = getDefaultClassNames()

    return (
        <DayPicker
            weekStartsOn={1}
            showOutsideDays={showOutsideDays}
            className={cn(
                'bg-white group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
                String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
                String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
                className
            )}
            captionLayout={captionLayout}
            formatters={{
                formatMonthDropdown: (date) =>
                    date.toLocaleString('default', { month: 'short' }),
                ...formatters,
            }}
            classNames={{
                root: cn('w-fit', defaultClassNames.root),
                months: cn(
                    'relative flex flex-col gap-4 md:flex-row',
                    defaultClassNames.months
                ),
                month: cn(
                    'flex w-full flex-col gap-4',
                    defaultClassNames.month
                ),
                nav: cn(
                    'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
                    defaultClassNames.nav
                ),
                button_previous: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'h-[--cell-size] w-[--cell-size] min-w-0 select-none p-0 aria-disabled:opacity-50 rounded-sm',
                    defaultClassNames.button_previous
                ),
                button_next: cn(
                    buttonVariants({ variant: buttonVariant }),
                    'h-[--cell-size] w-[--cell-size] min-w-0 select-none p-0 aria-disabled:opacity-50 rounded-sm',
                    defaultClassNames.button_next
                ),
                month_caption: cn(
                    'flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]',
                    defaultClassNames.month_caption
                ),
                dropdowns: cn(
                    'flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium',
                    defaultClassNames.dropdowns
                ),
                dropdown_root: cn(
                    'has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-sm border',
                    defaultClassNames.dropdown_root
                ),
                dropdown: cn(
                    'bg-popover absolute inset-0 opacity-0',
                    defaultClassNames.dropdown
                ),
                caption_label: cn(
                    'select-none font-medium',
                    captionLayout === 'label'
                        ? 'text-sm'
                        : '[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-sm pl-2 pr-1 text-sm [&>svg]:size-3.5',
                    defaultClassNames.caption_label
                ),
                table: 'w-full border-collapse',
                weekdays: cn('flex', defaultClassNames.weekdays),
                weekday: cn(
                    'text-muted-foreground flex-1 select-none rounded-sm text-[0.8rem] font-normal',
                    defaultClassNames.weekday
                ),
                week: cn('mt-1 flex w-full', defaultClassNames.week),
                week_number_header: cn(
                    'w-[--cell-size] select-none',
                    defaultClassNames.week_number_header
                ),
                week_number: cn(
                    'text-muted-foreground select-none text-[0.8rem]',
                    defaultClassNames.week_number
                ),
                day: cn(
                    'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-sm [&:last-child[data-selected=true]_button]:rounded-r-sm',
                    defaultClassNames.day
                ),
                range_start: 'bg-primary/10 rounded-l-sm',
                range_middle: 'bg-primary/10 rounded-none',
                range_end: 'bg-primary/10 rounded-r-sm',
                today: 'text-primary font-semibold',
                outside: cn(
                    'text-muted-foreground aria-selected:text-muted-foreground',
                    defaultClassNames.outside
                ),
                disabled: cn(
                    'text-muted-foreground opacity-50',
                    defaultClassNames.disabled
                ),
                hidden: cn('invisible', defaultClassNames.hidden),
                ...classNames,
            }}
            components={{
                Root: ({ className, rootRef, ...props }) => {
                    return (
                        <div
                            data-slot="calendar"
                            ref={rootRef}
                            className={cn(className)}
                            {...props}
                        />
                    )
                },
                Chevron: ({ className, orientation, ...props }) => {
                    if (orientation === 'left') {
                        return (
                            <ChevronLeftIcon
                                className={cn('size-4', className)}
                                {...props}
                            />
                        )
                    }

                    if (orientation === 'right') {
                        return (
                            <ChevronRightIcon
                                className={cn('size-4', className)}
                                {...props}
                            />
                        )
                    }

                    return (
                        <ChevronDownIcon
                            className={cn('size-4', className)}
                            {...props}
                        />
                    )
                },
                DayButton: CalendarDayButton,
                WeekNumber: ({ children, ...props }) => {
                    return (
                        <td {...props}>
                            <div className="flex size-[--cell-size] items-center justify-center text-center">
                                {children}
                            </div>
                        </td>
                    )
                },
                ...components,
            }}
            {...props}
        />
    )
}

function CalendarDayButton({
    className,
    day,
    modifiers,
    onClick,
    ...props
}: React.ComponentProps<typeof DayButton>) {
    const ref = React.useRef<HTMLButtonElement>(null)
    React.useEffect(() => {
        if (modifiers.focused) ref.current?.focus()
    }, [modifiers.focused])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
    }

    return (
        <Button
            ref={ref}
            variant="ghost"
            size="icon"
            onClick={handleClick}
            data-day={day.date.toLocaleDateString()}
            data-selected-single={
                modifiers.selected &&
                !modifiers.range_start &&
                !modifiers.range_end &&
                !modifiers.range_middle
            }
            data-range-start={modifiers.range_start}
            data-range-end={modifiers.range_end}
            data-range-middle={modifiers.range_middle}
            className={cn(
                'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:text-primary data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 text-sm font-normal leading-none data-[range-end=true]:rounded-sm data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-sm group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70 rounded-sm',
                className
            )}
            {...props}
        />
    )
}

export { Calendar, CalendarDayButton }
