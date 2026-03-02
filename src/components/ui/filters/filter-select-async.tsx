/**
 * Async Filter Select - Combobox with async loading support
 * Used for server-side search like provider selection
 */
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
import { Check, ChevronsUpDown, Loader2, X as XIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Control, Controller, FieldValues, get, Path } from 'react-hook-form'
import type { FilterSelectFooterItem } from './filter-select'

export interface FilterSelectAsyncOption {
    label: string
    value: string | number
    [key: string]: any
}

interface FilterSelectAsyncProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    label?: string
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    loadingText?: string
    className?: string
    disabled?: boolean
    showClearButton?: boolean
    asyncOptions: (searchQuery: string) => Promise<FilterSelectAsyncOption[]>
    getDefaultOptions?: (
        currentValue: any
    ) => Promise<FilterSelectAsyncOption[]>
    onChangeAfterHookForm?: (value: FilterSelectAsyncOption | null) => void
    debounceMs?: number
    minSearchLength?: number
    /** Footer items - custom actions at bottom of dropdown (e.g., "Add new item") */
    footerItems?: FilterSelectFooterItem[]
}

interface FilterSelectAsyncInnerProps {
    field: { value: any; onChange: (value: any) => void }
    error?: string
    label?: string
    placeholder: string
    searchPlaceholder: string
    emptyText: string
    loadingText: string
    className?: string
    disabled?: boolean
    showClearButton: boolean
    options: FilterSelectAsyncOption[]
    setOptions: (options: FilterSelectAsyncOption[]) => void
    isLoading: boolean
    setIsLoading: (loading: boolean) => void
    searchQuery: string
    handleSearchChange: (value: string) => void
    minSearchLength: number
    getDefaultOptions?: (
        currentValue: any
    ) => Promise<FilterSelectAsyncOption[]>
    onChangeAfterHookForm?: (value: FilterSelectAsyncOption | null) => void
    initialized: boolean
    setInitialized: (initialized: boolean) => void
    footerItems?: FilterSelectFooterItem[]
}

/** Inner component to handle field rendering with proper hooks */
function FilterSelectAsyncInner({
    field,
    error,
    label,
    placeholder,
    searchPlaceholder,
    emptyText,
    loadingText,
    className,
    disabled,
    showClearButton,
    options,
    setOptions,
    isLoading,
    setIsLoading,
    searchQuery,
    handleSearchChange,
    minSearchLength,
    getDefaultOptions,
    onChangeAfterHookForm,
    initialized,
    setInitialized,
    footerItems,
}: FilterSelectAsyncInnerProps) {
    const [open, setOpen] = useState(false)

    // Load default options when field has value
    useEffect(() => {
        if (field.value && getDefaultOptions && !initialized) {
            setIsLoading(true)
            getDefaultOptions(field.value)
                .then((defaultOpts) => {
                    setOptions(defaultOpts || [])
                    setInitialized(true)
                })
                .catch(console.error)
                .finally(() => setIsLoading(false))
        } else if (!field.value) {
            setInitialized(true)
        }
    }, [
        field.value,
        getDefaultOptions,
        initialized,
        setIsLoading,
        setOptions,
        setInitialized,
    ])

    const handleSelect = (option: FilterSelectAsyncOption) => {
        field.onChange(option)
        onChangeAfterHookForm?.(option)
        setOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        field.onChange(null)
        onChangeAfterHookForm?.(null)
        setOptions([])
    }

    const hasValue =
        field.value &&
        (typeof field.value === 'object' ? field.value.value : field.value)
    const displayLabel =
        typeof field.value === 'object'
            ? field.value?.label
            : options.find((o) => o.value === field.value)?.label

    return (
        <div className="relative">
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
                        <span className="truncate">
                            {hasValue ? displayLabel : placeholder}
                        </span>
                        <div className="flex items-center shrink-0 relative w-4 h-4">
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
                            value={searchQuery}
                            onValueChange={handleSearchChange}
                        />
                        <CommandList>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {loadingText}
                                </div>
                            ) : options.length === 0 ? (
                                <CommandEmpty>
                                    {searchQuery.length < minSearchLength
                                        ? searchPlaceholder
                                        : emptyText}
                                </CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {options.map((option) => {
                                        const isSelected =
                                            typeof field.value === 'object'
                                                ? String(field.value?.value) ===
                                                  String(option.value)
                                                : String(field.value) ===
                                                  String(option.value)
                                        return (
                                            <CommandItem
                                                key={String(option.value)}
                                                value={option.label}
                                                onSelect={() =>
                                                    handleSelect(option)
                                                }
                                                className={cn(
                                                    'whitespace-nowrap',
                                                    isSelected &&
                                                        'bg-primary/10 text-primary'
                                                )}
                                            >
                                                <Check
                                                    className={cn(
                                                        'mr-2 h-4 w-4 shrink-0',
                                                        isSelected
                                                            ? 'opacity-100'
                                                            : 'opacity-0'
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            )}
                        </CommandList>
                        {footerItems && footerItems.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    {footerItems.map((item) => (
                                        <CommandItem
                                            key={item.key}
                                            onSelect={() =>
                                                item.onClick(
                                                    setOpen,
                                                    searchQuery
                                                )
                                            }
                                            className={cn(
                                                'text-primary cursor-pointer',
                                                item.className
                                            )}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="text-xs text-destructive ps-2 mt-1">{error}</p>
            )}
        </div>
    )
}

/** Async combobox with server-side search and debouncing */
export function FilterSelectAsync<T extends FieldValues>({
    control,
    name,
    label,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results.',
    loadingText = 'Loading...',
    className,
    disabled,
    showClearButton = true,
    asyncOptions,
    getDefaultOptions,
    onChangeAfterHookForm,
    debounceMs = 300,
    minSearchLength = 1,
    footerItems,
}: FilterSelectAsyncProps<T>) {
    const [options, setOptions] = useState<FilterSelectAsyncOption[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [initialized, setInitialized] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const performSearch = useCallback(
        async (query: string) => {
            if (query.length < minSearchLength) {
                setOptions([])
                setIsLoading(false)
                return
            }
            setIsLoading(true)
            try {
                const results = await asyncOptions(query)
                setOptions(results || [])
            } catch (error) {
                console.error('Failed to fetch options:', error)
                setOptions([])
            } finally {
                setIsLoading(false)
            }
        },
        [asyncOptions, minSearchLength]
    )

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchQuery(value)
            if (debounceRef.current) clearTimeout(debounceRef.current)
            if (value.length >= minSearchLength) {
                setIsLoading(true)
                debounceRef.current = setTimeout(
                    () => performSearch(value),
                    debounceMs
                )
            } else {
                setOptions([])
                setIsLoading(false)
            }
        },
        [performSearch, minSearchLength, debounceMs]
    )

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current)
        }
    }, [])

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, formState }) => {
                const rawError = get(formState.errors, name)?.message as
                    | string
                    | undefined
                const error = rawError ? (rawError as string) : undefined
                return (
                    <FilterSelectAsyncInner
                        field={field}
                        error={error}
                        label={label}
                        placeholder={placeholder}
                        searchPlaceholder={searchPlaceholder}
                        emptyText={emptyText}
                        loadingText={loadingText}
                        className={className}
                        disabled={disabled}
                        showClearButton={showClearButton}
                        options={options}
                        setOptions={setOptions}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        searchQuery={searchQuery}
                        handleSearchChange={handleSearchChange}
                        minSearchLength={minSearchLength}
                        getDefaultOptions={getDefaultOptions}
                        onChangeAfterHookForm={onChangeAfterHookForm}
                        initialized={initialized}
                        setInitialized={setInitialized}
                        footerItems={footerItems}
                    />
                )
            }}
        />
    )
}
