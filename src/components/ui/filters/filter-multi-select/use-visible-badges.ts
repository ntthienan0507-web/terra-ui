import { useState, useRef, useEffect, useLayoutEffect } from 'react'

interface UseVisibleBadgesOptions {
    /** Selected values array */
    selectedValues: (string | number)[]
    /** Whether the dropdown is open */
    isOpen: boolean
}

/**
 * Hook to calculate how many badges can fit in container
 * Uses ResizeObserver and layout effects to measure badge widths
 */
export function useVisibleBadges({
    selectedValues,
    isOpen,
}: UseVisibleBadgesOptions) {
    const [visibleCount, setVisibleCount] = useState<number>(999)
    const containerRef = useRef<HTMLDivElement>(null)
    const badgeRefs = useRef<Map<string | number, HTMLSpanElement>>(new Map())

    // Calculate visible badges based on container width
    const calculateVisibleBadges = (
        container: HTMLDivElement,
        badges: HTMLSpanElement[],
        extraPadding = 0
    ) => {
        const containerWidth = container.offsetWidth
        const chevronWidth = extraPadding > 0 ? 32 : 20
        const availableWidth = containerWidth - chevronWidth - extraPadding

        let totalWidth = 0
        let count = 0

        // First pass: try to fit all badges without "+N"
        for (let i = 0; i < badges.length; i++) {
            const badgeWidth = badges[i]?.offsetWidth || 0
            const gapWidth = i > 0 ? 4 : 0

            if (totalWidth + badgeWidth + gapWidth <= availableWidth) {
                totalWidth += badgeWidth + gapWidth
                count++
            } else {
                break
            }
        }

        // If all fit, we're done
        if (count === badges.length) {
            return count
        }

        // Otherwise, recalculate with "+N" badge space reserved
        totalWidth = 0
        count = 0
        const moreWidth = extraPadding > 0 ? 40 : 36
        const usableWidth = availableWidth - moreWidth

        for (let i = 0; i < badges.length; i++) {
            const badgeWidth = badges[i]?.offsetWidth || 0
            const gapWidth = i > 0 ? 4 : 0

            if (totalWidth + badgeWidth + gapWidth <= usableWidth) {
                totalWidth += badgeWidth + gapWidth
                count++
            } else {
                break
            }
        }

        return Math.max(1, count)
    }

    // Initial calculation with ResizeObserver
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleResize = () => {
            const badges = Array.from(badgeRefs.current.values())
            if (badges.length === 0) return
            setVisibleCount(calculateVisibleBadges(container, badges))
        }

        handleResize()

        const resizeObserver = new ResizeObserver(handleResize)
        resizeObserver.observe(container)

        return () => resizeObserver.disconnect()
    }, [])

    // Recalculate when selected values change
    useLayoutEffect(() => {
        if (selectedValues.length === 0) return

        let cancelled = false
        let attempts = 0
        const maxAttempts = 50

        const recalculate = () => {
            if (cancelled) return

            const container = containerRef.current
            if (!container) return

            const badges = selectedValues
                .map((val) => badgeRefs.current.get(val))
                .filter(
                    (badge): badge is HTMLSpanElement => badge !== undefined
                )

            if (badges.length === 0) return

            // Wait until badges have width (rendered)
            const hasWidth = badges.every((badge) => badge.offsetWidth > 0)
            if (!hasWidth) {
                attempts++
                if (attempts < maxAttempts) {
                    setTimeout(recalculate, 20)
                }
                return
            }

            setVisibleCount(calculateVisibleBadges(container, badges))
        }

        setTimeout(recalculate, 0)
        return () => {
            cancelled = true
        }
    }, [selectedValues])

    // Recalculate when dropdown closes
    useLayoutEffect(() => {
        if (isOpen || selectedValues.length === 0) return

        let cancelled = false
        let attempts = 0
        const maxAttempts = 50

        const recalculate = () => {
            if (cancelled) return

            const container = containerRef.current
            if (!container) return

            const badges = selectedValues
                .map((val) => badgeRefs.current.get(val))
                .filter(
                    (badge): badge is HTMLSpanElement => badge !== undefined
                )

            if (badges.length === 0) return

            const hasWidth = badges.every((badge) => badge.offsetWidth > 0)
            if (!hasWidth) {
                attempts++
                if (attempts < maxAttempts) {
                    setTimeout(recalculate, 20)
                }
                return
            }

            setVisibleCount(calculateVisibleBadges(container, badges, 16))
        }

        setTimeout(recalculate, 0)
        return () => {
            cancelled = true
        }
    }, [isOpen, selectedValues])

    const setBadgeRef = (
        value: string | number,
        el: HTMLSpanElement | null
    ) => {
        if (el) {
            badgeRefs.current.set(value, el)
        } else {
            badgeRefs.current.delete(value)
        }
    }

    return {
        visibleCount,
        containerRef,
        setBadgeRef,
    }
}
