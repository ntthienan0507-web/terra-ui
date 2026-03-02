import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { DataTableProps } from '../types'

/**
 * Hook for managing sticky header functionality in data tables
 * Handles intersection observer, scroll sync, and dimension updates
 */
export function useDataTableStickyHeader<T>(
    stickyHeader: DataTableProps<T>['stickyHeader'],
    isMobile: boolean,
    rows: T[]
) {
    const isStickyHeaderEnabled = stickyHeader?.enabled !== false && !isMobile

    // Refs
    const tableWrapperRef = useRef<HTMLDivElement>(null)
    const headerSentinelRef = useRef<HTMLDivElement>(null)
    const stickyHeaderScrollRef = useRef<HTMLDivElement>(null)
    const tableScrollContainerRef = useRef<HTMLDivElement>(null)

    // State
    const [isHeaderSticky, setIsHeaderSticky] = useState(false)
    const [stickyHeaderWidth, setStickyHeaderWidth] = useState(0)
    const [stickyHeaderLeft, setStickyHeaderLeft] = useState(0)
    const [calculatedOffsetTop, setCalculatedOffsetTop] = useState(0)

    // Calculate offset from selector or use provided value
    useEffect(() => {
        if (!isStickyHeaderEnabled) return

        const calculateOffset = () => {
            // Use provided selector; when undefined, skip element lookup
            const selector = stickyHeader?.offsetTopSelector
            if (selector) {
                const element = document.querySelector(selector)
                if (element) {
                    setCalculatedOffsetTop(element.getBoundingClientRect().height)
                    return
                }
            }
            setCalculatedOffsetTop(stickyHeader?.offsetTop ?? 0)
        }

        calculateOffset()
        window.addEventListener('resize', calculateOffset)

        return () => window.removeEventListener('resize', calculateOffset)
    }, [
        isStickyHeaderEnabled,
        stickyHeader?.offsetTop,
        stickyHeader?.offsetTopSelector,
    ])

    // Reset sticky state when rows change (e.g., tab switch with different data)
    useLayoutEffect(() => {
        setIsHeaderSticky(false)
    }, [rows])

    // Reset sticky state when page becomes hidden (tab switch)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsHeaderSticky(false)
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [])

    // Sticky header IntersectionObserver
    useEffect(() => {
        if (!isStickyHeaderEnabled || !headerSentinelRef.current) return

        setIsHeaderSticky(false)

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (tableWrapperRef.current) {
                    const rect = tableWrapperRef.current.getBoundingClientRect()
                    const isTableVisible =
                        rect.height > 0 &&
                        rect.width > 0 &&
                        rect.top < window.innerHeight &&
                        rect.bottom > 0

                    setIsHeaderSticky(!entry.isIntersecting && isTableVisible)
                } else {
                    setIsHeaderSticky(false)
                }
            },
            {
                root: null,
                rootMargin: `-${calculatedOffsetTop}px 0px 0px 0px`,
                threshold: 0,
            }
        )

        observer.observe(headerSentinelRef.current)

        return () => {
            observer.disconnect()
            setIsHeaderSticky(false)
        }
    }, [isStickyHeaderEnabled, calculatedOffsetTop])

    // Update sticky header dimensions on resize and scroll
    useEffect(() => {
        if (!isStickyHeaderEnabled || !tableWrapperRef.current) return

        const updateDimensions = () => {
            if (tableWrapperRef.current) {
                const rect = tableWrapperRef.current.getBoundingClientRect()

                const isTableVisible =
                    rect.height > 0 &&
                    rect.width > 0 &&
                    rect.top < window.innerHeight &&
                    rect.bottom > 0

                if (isTableVisible) {
                    setStickyHeaderWidth(rect.width)
                    setStickyHeaderLeft(rect.left)
                } else {
                    setIsHeaderSticky(false)
                    setStickyHeaderWidth(0)
                    setStickyHeaderLeft(0)
                }
            }
        }

        const findScrollableParent = (
            element: HTMLElement | null
        ): HTMLElement | null => {
            if (!element) return null
            const style = getComputedStyle(element)
            if (style.overflowY === 'scroll' || style.overflowY === 'auto') {
                return element
            }
            return findScrollableParent(element.parentElement)
        }

        const scrollableParent = findScrollableParent(tableWrapperRef.current)

        updateDimensions()
        window.addEventListener('resize', updateDimensions)

        if (scrollableParent) {
            scrollableParent.addEventListener('scroll', updateDimensions, {
                passive: true,
            })
        }
        window.addEventListener('scroll', updateDimensions, { passive: true })

        return () => {
            window.removeEventListener('resize', updateDimensions)
            window.removeEventListener('scroll', updateDimensions)
            if (scrollableParent) {
                scrollableParent.removeEventListener('scroll', updateDimensions)
            }
            setStickyHeaderWidth(0)
            setStickyHeaderLeft(0)
        }
    }, [isStickyHeaderEnabled])

    // Sync horizontal scroll between sticky header and main table
    useEffect(() => {
        if (!isStickyHeaderEnabled || !isHeaderSticky) return

        const timeoutId = setTimeout(() => {
            const tableScroll = tableScrollContainerRef.current
            const stickyScroll = stickyHeaderScrollRef.current

            if (!tableScroll || !stickyScroll) return

            stickyScroll.scrollLeft = tableScroll.scrollLeft

            let isSyncing = false

            const syncTableToSticky = () => {
                if (isSyncing) return
                isSyncing = true
                requestAnimationFrame(() => {
                    if (stickyScroll) {
                        stickyScroll.scrollLeft = tableScroll.scrollLeft
                    }
                    isSyncing = false
                })
            }

            const syncStickyToTable = () => {
                if (isSyncing) return
                isSyncing = true
                requestAnimationFrame(() => {
                    if (tableScroll) {
                        tableScroll.scrollLeft = stickyScroll.scrollLeft
                    }
                    isSyncing = false
                })
            }

            tableScroll.addEventListener('scroll', syncTableToSticky, {
                passive: true,
            })
            stickyScroll.addEventListener('scroll', syncStickyToTable, {
                passive: true,
            })

            const cleanup = () => {
                tableScroll.removeEventListener('scroll', syncTableToSticky)
                stickyScroll.removeEventListener('scroll', syncStickyToTable)
            }

            ;(tableScrollContainerRef as any)._scrollCleanup = cleanup
        }, 0)

        return () => {
            clearTimeout(timeoutId)
            const cleanup = (tableScrollContainerRef as any)?._scrollCleanup
            if (cleanup) cleanup()
        }
    }, [isStickyHeaderEnabled, isHeaderSticky])

    return {
        isStickyHeaderEnabled,
        tableWrapperRef,
        headerSentinelRef,
        stickyHeaderScrollRef,
        tableScrollContainerRef,
        isHeaderSticky,
        stickyHeaderWidth,
        stickyHeaderLeft,
        calculatedOffsetTop,
    }
}
