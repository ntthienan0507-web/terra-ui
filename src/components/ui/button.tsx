import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[4px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 disabled:cursor-not-allowed min-w-[120px]',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow hover:bg-primary-hover',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover',
                success:
                    'bg-success text-success-foreground shadow hover:bg-success-hover',
                warning:
                    'bg-warning text-warning-foreground shadow hover:bg-warning-hover',
                info: 'bg-info text-info-foreground shadow hover:bg-info-hover',
                outline:
                    'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                'outline-primary':
                    'border-1 border-primary text-primary bg-background hover:bg-primary-lighter',
                'outline-destructive':
                    'border-1 border-destructive text-destructive bg-background hover:bg-destructive-lighter',
                'outline-success':
                    'border-1 border-success text-success bg-background hover:bg-success-lighter',
                'outline-warning':
                    'border-1 border-warning text-warning bg-background hover:bg-warning-lighter',
                'outline-info':
                    'border-1 border-info text-info bg-background hover:bg-info-lighter',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                'ghost-primary': 'text-primary hover:bg-primary-lighter',
                'ghost-destructive':
                    'text-destructive hover:bg-destructive-lighter',
                'ghost-success': 'text-success hover:bg-success-lighter',
                'ghost-warning': 'text-warning hover:bg-warning-lighter',
                'ghost-info': 'text-info hover:bg-info-lighter',
                link: 'text-primary underline-offset-4 hover:underline',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-[4px] px-3 text-xs min-w-0',
                lg: 'h-10 rounded-[4px] px-8',
                icon: 'h-9 w-9 min-w-0',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
)

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
