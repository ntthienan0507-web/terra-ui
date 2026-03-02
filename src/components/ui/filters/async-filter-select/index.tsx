import { Controller, FieldValues, get } from 'react-hook-form'
import { useAsyncPaginatedFetch } from './use-async-paginated-fetch'
import { AsyncSelectField } from './async-select-field'
import type { AsyncFilterSelectProps } from './types'

// Re-export types
export type {
    AsyncFilterSelectOption,
    AsyncFilterSelectPage,
    AsyncFilterSelectProps,
} from './types'

/**
 * AsyncFilterSelect Component
 * Async combobox with single/multiple selection, search, scroll pagination
 */
export function AsyncFilterSelect<T extends FieldValues>({
    control,
    name,
    asyncOptions,
    getDefaultOptions,
    label,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyText = 'No results.',
    className,
    disabled,
    multiple = false,
    showClearButton = true,
    onChangeAfterHookForm,
    pageSize = 5,
}: AsyncFilterSelectProps<T>) {
    const fetchState = useAsyncPaginatedFetch({
        control,
        name,
        asyncOptions,
        getDefaultOptions,
        multiple,
        pageSize,
    })

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
                    <AsyncSelectField
                        field={field}
                        error={error}
                        label={label}
                        placeholder={placeholder}
                        searchPlaceholder={searchPlaceholder}
                        emptyText={emptyText}
                        className={className}
                        disabled={disabled}
                        multiple={multiple}
                        showClearButton={showClearButton}
                        onChangeAfterHookForm={onChangeAfterHookForm}
                        {...fetchState}
                    />
                )
            }}
        />
    )
}
