import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const badgeVariants = cva(
    'inline-flex items-center rounded-[4px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary-hover',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary-hover',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive-hover',
                success:
                    'border-transparent bg-success text-success-foreground shadow hover:bg-success-hover',
                warning:
                    'border-transparent bg-warning text-warning-foreground shadow hover:bg-warning-hover',
                info: 'border-transparent bg-info text-info-foreground shadow hover:bg-info-hover',
                outline: 'text-foreground',
                'outline-primary':
                    'border-primary text-primary bg-primary-lighter',
                'outline-destructive':
                    'border-destructive text-destructive bg-destructive-lighter',
                'outline-success':
                    'border-success text-success bg-success-lighter',
                'outline-warning':
                    'border-warning text-warning bg-warning-lighter',
                'outline-info': 'border-info text-info bg-info-lighter',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface BadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
