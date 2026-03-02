import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { X as XIcon } from 'lucide-react'
import { Badge } from '../../badge'
import type { OverflowChipsProps } from './types'

/**
 * OverflowChips Component
 * Auto-calculates visible chips based on container width
 */
export function OverflowChips({
    options,
    values,
    onRemove,
    placeholder,
    disabled,
}: OverflowChipsProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const measureRef = useRef<HTMLDivElement>(null)
    const [visibleCount, setVisibleCount] = useState(values.length)
    const [containerWidth, setContainerWidth] = useState(0)

    // Update container width via ResizeObserver
    useEffect(() => {
        if (!containerRef.current) return

        const updateWidth = () => {
            if (containerRef.current) {
                requestAnimationFrame(() => {
                    if (containerRef.current) {
                        setContainerWidth(containerRef.current.offsetWidth)
                    }
                })
            }
        }

        updateWidth()

        const observer = new ResizeObserver(() => {
            updateWidth()
        })
        observer.observe(containerRef.current)
        return () => observer.disconnect()
    }, [])

    // Calculate how many chips can fit
    useLayoutEffect(() => {
        if (
            !measureRef.current ||
            values.length === 0 ||
            containerWidth === 0
        ) {
            setVisibleCount(values.length)
            return
        }

        const measureContainer = measureRef.current
        const chipElements = measureContainer.querySelectorAll('[data-chip]')
        const chipWidths: number[] = []
        chipElements.forEach((el) => {
            chipWidths.push((el as HTMLElement).offsetWidth + 4)
        })

        const overflowBadgeWidth = 48
        const minChipsToShow = 1

        let totalWidth = 0
        let count = 0

        for (let i = 0; i < chipWidths.length; i++) {
            const chipWidth = chipWidths[i]
            const remainingChips = values.length - (i + 1)
            const needsOverflow = remainingChips > 0

            const neededWidth = needsOverflow
                ? totalWidth + chipWidth + overflowBadgeWidth
                : totalWidth + chipWidth

            if (neededWidth <= containerWidth) {
                totalWidth += chipWidth
                count++
            } else {
                if (count === 0) count = minChipsToShow
                break
            }
        }

        setVisibleCount(Math.max(minChipsToShow, count))
    }, [values, containerWidth])

    if (values.length === 0) {
        return (
            <span className="text-muted-foreground truncate">
                {placeholder}
            </span>
        )
    }

    const visibleValues = values.slice(0, visibleCount)
    const overflowCount = values.length - visibleCount

    return (
        <div className="relative flex-1 min-w-0">
            {/* Hidden measurement container */}
            <div
                ref={measureRef}
                className="absolute top-0 left-0 invisible flex gap-1 pointer-events-none"
                style={{ width: 'max-content' }}
                aria-hidden="true"
            >
                {values.map((val: string | number) => {
                    const opt = options.find((o) => o.value === val)
                    return (
                        <Badge
                            key={val}
                            data-chip
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-5 gap-0.5 whitespace-nowrap max-w-[140px]"
                        >
                            {opt?.label || val}
                            <XIcon className="h-2 w-2 shrink-0" />
                        </Badge>
                    )
                })}
            </div>

            {/* Visible chips container */}
            <div
                ref={containerRef}
                className="flex items-center gap-1 overflow-hidden"
            >
                {visibleValues.map((val: string | number) => {
                    const opt = options.find((o) => o.value === val)
                    return (
                        <Badge
                            key={val}
                            variant="secondary"
                            className="text-xs px-1.5 py-0 h-5 gap-0.5 shrink-0 max-w-[140px] font-normal"
                        >
                            <span className="truncate">
                                {opt?.label || val}
                            </span>
                            {!disabled && (
                                <span
                                    role="button"
                                    tabIndex={-1}
                                    className="inline-flex shrink-0 cursor-pointer hover:text-destructive"
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(e, val)
                                    }}
                                >
                                    <XIcon className="h-2 w-2" />
                                </span>
                            )}
                        </Badge>
                    )
                })}
                {overflowCount > 0 && (
                    <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0 h-5 shrink-0 font-normal"
                    >
                        +{overflowCount}
                    </Badge>
                )}
            </div>
        </div>
    )
}
