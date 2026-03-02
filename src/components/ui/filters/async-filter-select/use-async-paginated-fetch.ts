import { useState, useEffect, useMemo, useRef } from 'react'
import { useWatch } from 'react-hook-form'
import useDebounce from '../../../../lib/hooks/use-debounce'
import type { AsyncFilterSelectOption, AsyncFilterSelectProps } from './types'

interface UseAsyncPaginatedFetchParams {
    control: AsyncFilterSelectProps<any>['control']
    name: AsyncFilterSelectProps<any>['name']
    asyncOptions: AsyncFilterSelectProps<any>['asyncOptions']
    getDefaultOptions?: AsyncFilterSelectProps<any>['getDefaultOptions']
    multiple: boolean
    pageSize: number
}

/** Merge two option arrays by value, deduplicating via Map */
function mergeOptions(
    existing: AsyncFilterSelectOption[],
    incoming: AsyncFilterSelectOption[]
): AsyncFilterSelectOption[] {
    const map = new Map<string | number, AsyncFilterSelectOption>()
    existing.forEach((o) => map.set(o.value, o))
    incoming.forEach((o) => map.set(o.value, o))
    return Array.from(map.values())
}

/**
 * Hook for async paginated fetching with infinite scroll support.
 * Handles: fetch on open, debounced search, scroll-based pagination,
 * default options loading, and option merging.
 */
export function useAsyncPaginatedFetch({
    control,
    name,
    asyncOptions,
    getDefaultOptions,
    multiple,
    pageSize,
}: UseAsyncPaginatedFetchParams) {
    const [open, setOpen] = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [selectedOptions, setSelectedOptions] = useState<
        AsyncFilterSelectOption[]
    >([])
    const [isLoadingDefaults, setIsLoadingDefaults] = useState(false)
    const selectedOptionsRef = useRef(selectedOptions)
    selectedOptionsRef.current = selectedOptions

    const debouncedSearch = useDebounce(searchValue, 300)

    // --- Pagination state ---
    const [fetchedOptions, setFetchedOptions] = useState<
        AsyncFilterSelectOption[]
    >([])
    const [isFetching, setIsFetching] = useState(false)
    const [isFetchingMore, setIsFetchingMore] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    // Refs — single source of truth for async logic (no stale closures)
    const pageRef = useRef(1)
    const fetchingRef = useRef(false)
    const hasMoreRef = useRef(true)
    const searchRef = useRef('')
    const asyncOptionsRef = useRef(asyncOptions)
    asyncOptionsRef.current = asyncOptions
    const pageSizeRef = useRef(pageSize)
    pageSizeRef.current = pageSize
    const listRef = useRef<HTMLDivElement>(null)
    const openRef = useRef(false)

    // Watch field value to load default options labels
    const fieldValue = useWatch({ control, name })

    useEffect(() => {
        if (!getDefaultOptions) return

        const selectedValues = multiple
            ? Array.isArray(fieldValue)
                ? fieldValue
                : []
            : fieldValue
              ? [fieldValue]
              : []

        if (selectedValues.length === 0) return

        const missingValues = selectedValues.filter(
            (v: any) => !selectedOptionsRef.current.find((o) => o.value === v)
        )
        if (missingValues.length === 0) return

        setIsLoadingDefaults(true)
        getDefaultOptions(missingValues)
            .then((opts) => {
                setSelectedOptions((prev) => mergeOptions(prev, opts))
            })
            .finally(() => setIsLoadingDefaults(false))
    }, [fieldValue, getDefaultOptions, multiple])

    // --- Fetch a single page ---
    async function doFetch(page: number, search: string, reset: boolean) {
        if (fetchingRef.current) return
        fetchingRef.current = true

        if (reset) {
            setIsFetching(true)
        } else {
            setIsFetchingMore(true)
        }

        try {
            const result = await asyncOptionsRef.current(search, page)

            // Discard stale results
            if (searchRef.current !== search) return
            if (!openRef.current) return

            // Plain array = no pagination, no infinite scroll
            // Page object = use hasMore from API (page_next !== -1)
            const pageData = Array.isArray(result)
                ? { options: result, hasMore: false }
                : result

            pageRef.current = page
            hasMoreRef.current = pageData.hasMore
            setHasMore(pageData.hasMore)
            setFetchedOptions((prev) =>
                reset ? pageData.options : [...prev, ...pageData.options]
            )
        } finally {
            fetchingRef.current = false
            setIsFetching(false)
            setIsFetchingMore(false)
        }
    }

    // --- Trigger fetch from popover open ---
    function handleOpenChange(newOpen: boolean) {
        // Guard: prevent re-entry if already open (Radix can fire multiple times)
        if (newOpen && openRef.current) return
        openRef.current = newOpen
        setOpen(newOpen)
        if (newOpen) {
            searchRef.current = ''
            pageRef.current = 1
            hasMoreRef.current = true
            fetchingRef.current = false
            setSearchValue('')
            setHasMore(true)
            setFetchedOptions([])
            doFetch(1, '', true)
        }
    }

    // --- Trigger re-fetch when search changes (while open) ---
    const prevDebouncedSearch = useRef(debouncedSearch)
    useEffect(() => {
        if (prevDebouncedSearch.current === debouncedSearch) return
        prevDebouncedSearch.current = debouncedSearch
        if (!open) return

        searchRef.current = debouncedSearch
        pageRef.current = 1
        hasMoreRef.current = true
        fetchingRef.current = false
        setHasMore(true)
        setFetchedOptions([])
        doFetch(1, debouncedSearch, true)
    }, [debouncedSearch, open])

    // Merge fetched + selected for display
    const allOptions = useMemo(() => {
        const map = new Map<string | number, AsyncFilterSelectOption>()
        selectedOptions.forEach((opt) => map.set(opt.value, opt))
        fetchedOptions.forEach((opt) => map.set(opt.value, opt))
        return Array.from(map.values())
    }, [fetchedOptions, selectedOptions])

    const isFullyLoaded = !hasMore

    const displayOptions = useMemo(() => {
        if (!isFullyLoaded || !searchValue.trim()) return allOptions
        const search = searchValue.toLowerCase().trim()
        return allOptions.filter((opt) =>
            opt.label.toLowerCase().includes(search)
        )
    }, [allOptions, isFullyLoaded, searchValue])

    // --- Scroll + auto-fill: check if more data needed ---
    useEffect(() => {
        const el = listRef.current
        if (!el || !open) return

        const check = () => {
            const distanceFromBottom =
                el.scrollHeight - el.scrollTop - el.clientHeight
            if (
                distanceFromBottom < 50 &&
                hasMoreRef.current &&
                !fetchingRef.current
            ) {
                doFetch(pageRef.current + 1, searchRef.current, false)
            }
        }

        // Auto-fill: effect runs after DOM commit, layout is up-to-date
        check()

        el.addEventListener('scroll', check, { passive: true })
        return () => el.removeEventListener('scroll', check)
    }, [open, fetchedOptions.length])

    return {
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
    }
}
