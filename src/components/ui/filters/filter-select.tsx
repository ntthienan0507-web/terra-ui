import { Button } from '../button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '../command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../popover'
import { FLOATING_LABEL_STYLES } from '../form-field'
import { cn } from '../../../lib/utils'
import { Check, ChevronsUpDown, X as XIcon } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Control, Controller, FieldValues, Path } from 'react-hook-form'

export interface FilterSelectOption {
    label: string
    value: string | number
}

export interface FilterSelectFooterItem {
    /** Unique key for the item */
    key: string
    /** Display label */
    label: string
    /** Icon to show before label */
    icon?: ReactNode
    /** Click handler - receives setOpen to close popover, and optional searchQuery */
    onClick: (setOpen: (open: boolean) => void, searchQuery?: string) => void
    /** Additional className */
    className?: string
}

interface FilterSelectProps<T extends FieldValues> {
    /** react-hook-form control */
    control: Control<T>
    /** Field name */
    name: Path<T>
    /** Select options */
    options: FilterSelectOption[]
    /** Label text */
    label?: string
    /** Placeholder text */
    placeholder?: string
    /** Search placeholder */
    searchPlaceholder?: string
    /** Empty state text */
    emptyText?: string
    /** Additional className for trigger */
    className?: string
    /** Disabled state */
    disabled?: boolean
    /** Show clear button (default: true) */
    showClearButton?: boolean
    /** Callback after value change (for URL sync) */
    onChangeAfterHookForm?: (value: any) => void
    /** Footer items - custom actions at bottom of dropdown (e.g., "Add new item") */
    footerItems?: FilterSelectFooterItem[]
}

/**
 * FilterSelect - Combobox component for FilterBar
 * Uses Command + Popover for searchable dropdown
 *
 * @example
 * <FilterSelect
 *     control={control}
 *     name="department_id"
 *     label="Department"
 *     placeholder="Select..."
 *     options={departments}
 *     onChangeAfterHookForm={(val) => setFilter('department_id', val)}
 * />
 */
export function FilterSelect<T extends FieldValues>({
    control,
    name,
    options,
    label,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results.',
    className,
    disabled,
    showClearButton = true,
    onChangeAfterHookForm,
    footerItems,
}: FilterSelectProps<T>) {
    const [open, setOpen] = useState(false)

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const handleSelect = (currentValue: string) => {
                    // Find option to get original typed value
                    const option = options.find(
                        (o) => String(o.value) === currentValue
                    )
                    const typedValue = option ? option.value : currentValue

                    // Toggle selection if same value
                    const isSameValue = String(field.value) === currentValue
                    const newValue = isSameValue
                        ? typeof options[0]?.value === 'number'
                            ? 0
                            : ''
                        : typedValue

                    field.onChange(newValue)
                    onChangeAfterHookForm?.(newValue)
                    setOpen(false)
                }

                const handleClear = (e: React.MouseEvent) => {
                    e.stopPropagation()
                    const emptyValue =
                        typeof options[0]?.value === 'number' ? 0 : ''
                    field.onChange(emptyValue)
                    onChangeAfterHookForm?.(emptyValue)
                }

                const hasValue =
                    field.value !== undefined &&
                    field.value !== null &&
                    field.value !== '' &&
                    field.value !== 0
                const selectedOption = options.find(
                    (o) => String(o.value) === String(field.value)
                )

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
                                <span
                                    className={cn(
                                        'truncate',
                                        !hasValue &&
                                            'italic text-xs text-muted-foreground/50'
                                    )}
                                >
                                    {hasValue
                                        ? selectedOption?.label
                                        : placeholder}
                                </span>
                                <div className="flex items-center shrink-0 relative w-4 h-4">
                                    {showClearButton &&
                                        hasValue &&
                                        !disabled && (
                                            <div
                                                role="button"
                                                tabIndex={-1}
                                                className="absolute inset-0 z-10 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-pointer transition-opacity flex items-center justify-center"
                                                onClick={handleClear}
                                                onKeyDown={(e) =>
                                                    e.key === 'Enter' &&
                                                    handleClear(e as any)
                                                }
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </div>
                                        )}
                                    <ChevronsUpDown
                                        className={cn(
                                            'h-4 w-4 opacity-50 transition-opacity',
                                            showClearButton &&
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
                                                    handleSelect(
                                                        String(option.value)
                                                    )
                                                }
                                                className={cn(
                                                    'whitespace-nowrap',
                                                    String(field.value) ===
                                                        String(option.value) &&
                                                        'bg-primary/10 text-primary'
                                                )}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4 shrink-0',
                                                        String(field.value) ===
                                                            String(option.value)
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                    {/* Footer items (e.g., "Add new item") */}
                                    {footerItems && footerItems.length > 0 && (
                                        <>
                                            <CommandSeparator />
                                            <CommandGroup>
                                                {footerItems.map((item) => (
                                                    <CommandItem
                                                        key={item.key}
                                                        value={`__footer__${item.key}`}
                                                        onSelect={() =>
                                                            item.onClick(
                                                                setOpen
                                                            )
                                                        }
                                                        className={cn(
                                                            'whitespace-nowrap text-primary font-medium',
                                                            item.className
                                                        )}
                                                    >
                                                        {item.icon && (
                                                            <span className="mr-2 shrink-0">
                                                                {item.icon}
                                                            </span>
                                                        )}
                                                        {item.label}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </>
                                    )}
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                )
            }}
        />
    )
}
