import type { ReactNode } from 'react'
import { cn } from '../../../../lib/utils'
import { Badge } from '../../badge'
import { Chip, dotColorMap } from '../../chip'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '../../tooltip'
import type { ChipFormatterConfig, ChipColorConfig } from './types'

/**
 * Render chip formatter
 */
export function renderChipFormatter<T = any>(
    value: any,
    row: T,
    config: ChipFormatterConfig<T>
): ReactNode {
    const {
        colorMap,
        defaultConfig,
        size = 'sm',
        showDot = false,
        className,
        variant = 'chip',
        textTransform = 'none',
        clickable = false,
        onClick,
        tooltip,
    } = config

    // Get chip config
    let chipConfig: ChipColorConfig | undefined
    if (typeof colorMap === 'function') {
        chipConfig = colorMap(value, row)
    } else {
        chipConfig = colorMap[value]
    }

    // Use default if not found
    if (!chipConfig) {
        chipConfig = defaultConfig || {
            label: String(value),
            color: 'default',
        }
    }

    const label = chipConfig.label || String(value)

    // Text transform class
    const transformClass = {
        uppercase: 'uppercase',
        lowercase: 'lowercase',
        capitalize: 'capitalize',
        none: '',
    }[textTransform]

    // Render based on variant
    let chipElement: ReactNode

    if (variant === 'dot') {
        chipElement = (
            <div
                className={cn(
                    'flex items-center gap-1.5',
                    clickable && 'cursor-pointer hover:opacity-80',
                    className
                )}
                onClick={
                    clickable && onClick ? () => onClick(value, row) : undefined
                }
            >
                <span
                    className={cn(
                        'w-2 h-2 rounded-full',
                        dotColorMap[chipConfig.color]
                    )}
                />
                <span className={cn('text-sm', transformClass)}>{label}</span>
            </div>
        )
    } else if (variant === 'badge') {
        chipElement = (
            <Badge
                variant={chipConfig.color as any}
                className={cn(
                    'cursor-default',
                    clickable && 'cursor-pointer hover:opacity-80',
                    transformClass,
                    className
                )}
                onClick={
                    clickable && onClick ? () => onClick(value, row) : undefined
                }
            >
                {chipConfig.icon && (
                    <span className="mr-1">{chipConfig.icon}</span>
                )}
                {label}
            </Badge>
        )
    } else {
        // chip variant - use Chip component
        chipElement = (
            <Chip
                variant={chipConfig.color}
                size={size}
                showDot={showDot}
                icon={chipConfig.icon}
                className={cn(
                    clickable && 'cursor-pointer hover:opacity-80',
                    transformClass,
                    chipConfig.className,
                    className
                )}
                onClick={
                    clickable && onClick ? () => onClick(value, row) : undefined
                }
            >
                {label}
            </Chip>
        )
    }

    // Wrap with tooltip if provided
    if (tooltip) {
        const tooltipText =
            typeof tooltip === 'function' ? tooltip(value, row) : tooltip
        return (
            <Tooltip>
                <TooltipTrigger asChild>{chipElement}</TooltipTrigger>
                <TooltipContent>{tooltipText}</TooltipContent>
            </Tooltip>
        )
    }

    return chipElement
}
