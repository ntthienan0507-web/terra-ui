import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const chipVariants = cva(
    'inline-flex items-center gap-1 rounded-full border font-normal transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800 border-gray-200',
                success: 'bg-green-100 text-green-800 border-green-200',
                warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                error: 'bg-red-100 text-red-800 border-red-200',
                info: 'bg-blue-100 text-blue-800 border-blue-200',
                primary: 'bg-primary/10 text-primary border-primary/20',
                secondary:
                    'bg-secondary/10 text-secondary-foreground border-secondary/20',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-2.5 py-1 text-sm',
                lg: 'px-3 py-1.5 text-base',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'sm',
        },
    }
)

const dotColorMap: Record<string, string> = {
    default: 'bg-gray-400',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
}

export interface ChipProps
    extends
        React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof chipVariants> {
    showDot?: boolean
    icon?: React.ReactNode
}

function Chip({
    className,
    variant,
    size,
    showDot,
    icon,
    children,
    ...props
}: ChipProps) {
    return (
        <span
            className={cn(chipVariants({ variant, size }), className)}
            {...props}
        >
            {showDot && (
                <span
                    className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        dotColorMap[variant || 'default']
                    )}
                />
            )}
            {icon && <span>{icon}</span>}
            {children}
        </span>
    )
}

export { Chip, chipVariants, dotColorMap }
