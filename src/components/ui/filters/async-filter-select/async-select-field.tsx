import { Check, ChevronsUpDown, X as XIcon, Loader2 } from 'lucide-react'
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
import { FLOATING_LABEL_STYLES } from '../../form-field'
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'
import { OverflowChips } from './overflow-chips'
import type { AsyncFilterSelectOption } from './types'

interface AsyncSelectFieldProps<T extends FieldValues> {
    field: ControllerRenderProps<T, Path<T>>
    error?: string
    label?: string
    placeholder: string
    searchPlaceholder: string
    emptyText: string
    className?: string
    disabled?: boolean
    multiple: boolean
    showClearButton: boolean
    onChangeAfterHookForm?: (value: any) => void
    // From useAsyncPaginatedFetch
    open: boolean
    searchValue: string
    setSearchValue: (v: string) => void
    selectedOptions: AsyncFilterSelectOption[]
    setSelectedOptions: React.Dispatch<
        React.SetStateAction<AsyncFilterSelectOption[]>
    >
    isLoadingDefaults: boolean
    isFetching: boolean
    isFetchingMore: boolean
    displayOptions: AsyncFilterSelectOption[]
    listRef: React.RefObject<HTMLDivElement | null>
    openRef: React.MutableRefObject<boolean>
    handleOpenChange: (open: boolean) => void
}

/** Get display text for the trigger button */
function getDisplayText(
    fieldValue: any,
    hasValue: boolean,
    multiple: boolean,
    selectedOptions: AsyncFilterSelectOption[],
    placeholder: string
): string {
    if (!hasValue) return placeholder

    if (multiple) {
        const values = Array.isArray(fieldValue) ? fieldValue : []
        if (values.length === 0) return placeholder
        if (values.length === 1) {
            const opt = selectedOptions.find((o) => o.value === values[0])
            return opt?.label || `${values[0]}`
        }
        return `${values.length} selected`
    }

    const opt = selectedOptions.find((o) => o.value === fieldValue)
    return opt?.label || `${fieldValue}`
}

/** Check if a value is currently selected */
function checkSelected(fieldValue: any, multiple: boolean, value: any) {
    if (multiple) {
        return Array.isArray(fieldValue) && fieldValue.includes(value)
    }
    return fieldValue === value
}

/**
 * Inner field component for AsyncFilterSelect.
 * Separated from Controller render to reduce cognitive complexity.
 */
export function AsyncSelectField<T extends FieldValues>({
    field,
    error,
    label,
    placeholder,
    searchPlaceholder,
    emptyText,
    className,
    disabled,
    multiple,
    showClearButton,
    onChangeAfterHookForm,
    open,
    searchValue,
    setSearchValue,
    selectedOptions,
    setSelectedOptions,
    isLoadingDefaults,
    isFetching,
    isFetchingMore,
    displayOptions,
    listRef,
    openRef,
    handleOpenChange,
}: AsyncSelectFieldProps<T>) {
    const hasValue = multiple
        ? Array.isArray(field.value) && field.value.length > 0
        : field.value !== undefined &&
          field.value !== null &&
          field.value !== ''

    const multipleValues =
        multiple && Array.isArray(field.value) ? field.value : []
    const isInitialLoading = isFetching && displayOptions.length === 0

    const handleSelect = (option: AsyncFilterSelectOption) => {
        if (multiple) {
            const currentValues: (string | number)[] = Array.isArray(
                field.value
            )
                ? field.value
                : []
            const isSelected = currentValues.includes(option.value)
            const newValues = isSelected
                ? currentValues.filter((v: any) => v !== option.value)
                : [...currentValues, option.value]

            field.onChange(newValues)
            onChangeAfterHookForm?.(newValues)

            if (!isSelected) {
                setSelectedOptions((prev) => {
                    if (prev.find((o) => o.value === option.value)) return prev
                    return [...prev, option]
                })
            }
        } else {
            const newValue = field.value === option.value ? '' : option.value
            field.onChange(newValue)
            onChangeAfterHookForm?.(newValue)
            openRef.current = false
            handleOpenChange(false)

            if (newValue) {
                setSelectedOptions([option])
            }
        }
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        const emptyValue = multiple ? [] : ''
        field.onChange(emptyValue)
        onChangeAfterHookForm?.(emptyValue)
        setSelectedOptions([])
    }

    const handleRemoveItem = (e: React.MouseEvent, value: any) => {
        e.stopPropagation()
        if (!multiple) return
        const currentValues: (string | number)[] = Array.isArray(field.value)
            ? field.value
            : []
        const newValues = currentValues.filter((v: any) => v !== value)
        field.onChange(newValues)
        onChangeAfterHookForm?.(newValues)
    }

    return (
        <div className="relative">
            <Popover open={open} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'w-full justify-between font-normal group relative hover:bg-transparent hover:text-inherit',
                            multiple && hasValue
                                ? 'h-auto min-h-9 py-1'
                                : 'h-9',
                            !hasValue && 'text-muted-foreground',
                            error &&
                                'border-destructive hover:border-destructive',
                            className
                        )}
                    >
                        {label && (
                            <span
                                className={cn(
                                    FLOATING_LABEL_STYLES.base,
                                    FLOATING_LABEL_STYLES.bg,
                                    error
                                        ? FLOATING_LABEL_STYLES.error
                                        : FLOATING_LABEL_STYLES.default
                                )}
                            >
                                {label}
                            </span>
                        )}
                        {isLoadingDefaults ? (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            </span>
                        ) : multiple && hasValue ? (
                            <OverflowChips
                                options={selectedOptions}
                                values={multipleValues}
                                onRemove={handleRemoveItem}
                                placeholder={placeholder}
                                disabled={disabled}
                            />
                        ) : (
                            <span
                                className={cn(
                                    'truncate',
                                    !hasValue &&
                                        'italic text-xs text-muted-foreground/50'
                                )}
                            >
                                {getDisplayText(
                                    field.value,
                                    hasValue,
                                    multiple,
                                    selectedOptions,
                                    placeholder
                                )}
                            </span>
                        )}
                        <div className="flex items-center shrink-0 relative w-4 h-4 ml-1">
                            {showClearButton && hasValue && !disabled && (
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
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onValueChange={setSearchValue}
                        />
                        <CommandList
                            ref={listRef as React.RefObject<HTMLDivElement>}
                            className="max-h-[200px]"
                        >
                            {isInitialLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                </div>
                            ) : displayOptions.length === 0 ? (
                                <CommandEmpty>{emptyText}</CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {displayOptions.map((option) => (
                                        <CommandItem
                                            key={String(option.value)}
                                            value={String(option.value)}
                                            onSelect={() =>
                                                handleSelect(option)
                                            }
                                            className={cn(
                                                'whitespace-nowrap cursor-pointer',
                                                checkSelected(
                                                    field.value,
                                                    multiple,
                                                    option.value
                                                ) &&
                                                    'bg-primary/10 text-primary'
                                            )}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4 shrink-0',
                                                    checkSelected(
                                                        field.value,
                                                        multiple,
                                                        option.value
                                                    )
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                            {option.label}
                                        </CommandItem>
                                    ))}
                                    {isFetchingMore && (
                                        <div className="flex items-center justify-center py-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        </div>
                                    )}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="text-xs text-destructive ps-2 mt-1">{error}</p>
            )}
        </div>
    )
}
