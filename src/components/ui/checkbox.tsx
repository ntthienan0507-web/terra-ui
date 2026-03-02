import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'

import { cn } from '../../lib/utils'

export interface CheckboxProps extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    'checked'
> {
    size?: 'small' | 'medium' | 'large'
    indeterminate?: boolean
    checked?: boolean
}

const sizeVariants = {
    small: {
        box: 'h-3 w-3',
        icon: 'h-3 w-3',
    },
    medium: {
        box: 'h-4 w-4',
        icon: 'h-4 w-4',
    },
    large: {
        box: 'h-5 w-5',
        icon: 'h-5 w-5',
    },
}

const Checkbox = React.forwardRef<
    React.ElementRef<typeof CheckboxPrimitive.Root>,
    CheckboxProps
>(({ className, size = 'medium', indeterminate, checked, ...props }, ref) => {
    const sizeClasses = sizeVariants[size]
    const checkedState = indeterminate ? 'indeterminate' : checked

    return (
        <CheckboxPrimitive.Root
            ref={ref}
            checked={checkedState}
            className={cn(
                'peer shrink-0 rounded-[2px] border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'border-primary',
                'disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-100 disabled:opacity-70',
                'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
                sizeClasses.box,
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                className={cn('flex items-center justify-center text-current')}
            >
                {indeterminate ? (
                    <Minus className={sizeClasses.icon} />
                ) : (
                    <Check className={sizeClasses.icon} />
                )}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
