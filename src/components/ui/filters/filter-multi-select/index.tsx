import { useState } from 'react'
import { Check, ChevronsUpDown, X as XIcon } from 'lucide-react'
import { cn } from '../../../../lib/utils'
import { Button } from '../../button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../../command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../popover'
import { Badge } from '../../badge'
import { FLOATING_LABEL_STYLES } from '../../form-field'
import { Controller, FieldValues, useWatch } from 'react-hook-form'
import { useVisibleBadges } from './use-visible-badges'
import type { FilterMultiSelectProps } from './types'

// Re-export types
export type { FilterMultiSelectOption, FilterMultiSelectProps } from './types'

/**
 * FilterMultiSelect - Multi-select combobox for FilterBar
 * Uses Command + Popover for searchable dropdown with multiple selection
 *
 * @example
 * <FilterMultiSelect
 *     control={control}
 *     name="department_ids"
 *     label="Departments"
 *     placeholder="Select..."
 *     options={departments}
 *     onChangeAfterHookForm={(val) => setFilter('department_ids', val)}
 * />
 */
export function FilterMultiSelect<T extends FieldValues>({
    control,
    name,
    options,
    label,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results.',
    className,
    disabled,
    onChangeAfterHookForm,
}: FilterMultiSelectProps<T>) {
    const [open, setOpen] = useState(false)

    // Watch field value changes
    const fieldValue = useWatch({ control, name })
    const selectedValues: (string | number)[] = fieldValue || []

    // Calculate visible badges
    const { visibleCount, containerRef, setBadgeRef } = useVisibleBadges({
        selectedValues,
        isOpen: open,
    })

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const selected: (string | number)[] = field.value || []

                const handleSelect = (value: string | number) => {
                    const newSelected = selected.includes(value)
                        ? selected.filter((s) => s !== value)
                        : [...selected, value]
                    field.onChange(newSelected)
                    onChangeAfterHookForm?.(newSelected)
                }

                const handleUnselect = (
                    e: React.MouseEvent,
                    value: string | number
                ) => {
                    e.preventDefault()
                    e.stopPropagation()
                    const newSelected = selected.filter((s) => s !== value)
                    field.onChange(newSelected)
                    onChangeAfterHookForm?.(newSelected)
                }

                const handleClear = (e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    field.onChange([])
                    onChangeAfterHookForm?.([])
                }

                const hasValue = selected.length > 0

                return (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                disabled={disabled}
                                className={cn(
                                    'w-full justify-between font-normal group relative h-9 hover:bg-transparent hover:text-inherit',
                                    !hasValue && 'text-muted-foreground',
                                    className
                                )}
                            >
                                {label && (
                                    <span
                                        className={cn(
                                            FLOATING_LABEL_STYLES.base,
                                            FLOATING_LABEL_STYLES.bg,
                                            FLOATING_LABEL_STYLES.default
                                        )}
                                    >
                                        {label}
                                    </span>
                                )}
                                <div
                                    ref={containerRef}
                                    className="flex gap-1 flex-nowrap flex-1 min-w-0 overflow-hidden items-center"
                                >
                                    {hasValue ? (
                                        <>
                                            {selected.map((item, index) => {
                                                const option = options.find(
                                                    (o) => o.value === item
                                                )
                                                const isVisible =
                                                    index < visibleCount

                                                return (
                                                    <span
                                                        key={item}
                                                        ref={(el) =>
                                                            setBadgeRef(
                                                                item,
                                                                el
                                                            )
                                                        }
                                                        style={{
                                                            visibility:
                                                                isVisible
                                                                    ? 'visible'
                                                                    : 'hidden',
                                                            position: isVisible
                                                                ? 'relative'
                                                                : 'absolute',
                                                        }}
                                                    >
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs px-1.5 py-0 h-5 gap-0.5 shrink-0 max-w-[140px] font-normal"
                                                        >
                                                            <span className="truncate">
                                                                {option?.label}
                                                            </span>
                                                            <span
                                                                role="button"
                                                                tabIndex={-1}
                                                                className="inline-flex shrink-0 cursor-pointer hover:text-destructive"
                                                                onMouseDown={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                }}
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation()
                                                                    handleUnselect(
                                                                        e,
                                                                        item
                                                                    )
                                                                }}
                                                            >
                                                                <XIcon className="h-2 w-2" />
                                                            </span>
                                                        </Badge>
                                                    </span>
                                                )
                                            })}
                                            {selected.length > visibleCount && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-[10px] px-1.5 py-0 h-5 shrink-0 font-normal"
                                                >
                                                    +
                                                    {selected.length -
                                                        visibleCount}
                                                </Badge>
                                            )}
                                        </>
                                    ) : (
                                        <span className="truncate italic text-xs text-muted-foreground/50">
                                            {placeholder}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center shrink-0 relative w-4 h-4 ml-1">
                                    {hasValue && !disabled && (
                                        <div
                                            role="button"
                                            tabIndex={-1}
                                            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-pointer transition-opacity flex items-center justify-center"
                                            onClick={handleClear}
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </div>
                                    )}
                                    <ChevronsUpDown
                                        className={cn(
                                            'h-4 w-4 opacity-50 transition-opacity',
                                            hasValue &&
                                                !disabled &&
                                                'group-hover:opacity-0'
                                        )}
                                    />
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="min-w-[--radix-popover-trigger-width] w-auto p-0"
                            align="start"
                        >
                            <Command>
                                <CommandInput placeholder={searchPlaceholder} />
                                <CommandList>
                                    <CommandEmpty>{emptyText}</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={String(option.value)}
                                                value={option.label}
                                                onSelect={() =>
                                                    handleSelect(option.value)
                                                }
                                                className={cn(
                                                    'whitespace-nowrap',
                                                    selected.includes(
                                                        option.value
                                                    ) &&
                                                        'bg-primary/10 text-primary'
                                                )}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4 shrink-0',
                                                        selected.includes(
                                                            option.value
                                                        )
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )
            }}
        />
    )
}
