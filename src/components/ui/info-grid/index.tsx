/**
 * InfoGrid — Structured key-value display in a responsive 4-column grid.
 * Replacement for GridInformation from vnetwork-ui.
 *
 * Usage:
 *   <InfoGrid
 *     title="Section Title"
 *     icon={<SomeIcon />}
 *     items={[
 *       { label: 'Name', value: 'John Doe' },
 *       { label: 'Status', value: <Badge>Active</Badge> },
 *       { label: 'Description', value: longText, className: 'md:col-span-2' },
 *       { label: 'Hidden', value: secret, hidden: true },
 *     ]}
 *     footer={<Button>Edit</Button>}
 *   />
 */
import { Chip } from '../chip'
import { cn } from '../../../lib/utils'
import type { ReactNode } from 'react'

// ============================================================================
// Types
// ============================================================================

export interface InfoGridItem {
    /** Display label */
    label: string
    /** Display value — accepts any ReactNode (string, number, JSX) */
    value: ReactNode
    /** Conditionally hide this item */
    hidden?: boolean
    /** Tailwind classes for grid span, e.g. 'md:col-span-2' */
    className?: string
}

export interface InfoGridProps {
    /** Section title */
    title?: string
    /** Icon displayed before the title */
    icon?: ReactNode
    /** Array of key-value items */
    items: InfoGridItem[]
    /** Footer content (buttons, actions) */
    footer?: ReactNode
    /** Additional className for the root container */
    className?: string
    /** data-tour attribute for guided tours */
    'data-tour'?: string
}

// ============================================================================
// Component
// ============================================================================

// ============================================================================
// Helpers — Common value renderers for migration convenience
// ============================================================================

interface StatusOption {
    value: string
    label: string
    color: string
}

/** Render a status chip by matching value against options array.
 *  Replaces `component: 'Status'` from GridInformation. */
export function StatusChip({
    value,
    options,
}: Readonly<{
    value: string
    options: StatusOption[]
}>) {
    const match = options.find((opt) => opt.value === value)
    if (!match) return <span>---</span>
    return (
        <Chip variant={match.color as any} size="sm">
            {match.label}
        </Chip>
    )
}

export function InfoGrid({
    title,
    icon,
    items,
    footer,
    className,
    ...props
}: InfoGridProps) {
    const visibleItems = items.filter((item) => !item.hidden)

    return (
        <div
            className={cn(
                'rounded-md bg-card text-card-foreground space-y-2',
                className
            )}
            {...props}
        >
            {/* Header */}
            {title && (
                <div className="flex items-center gap-2 p-4 pb-2">
                    {icon && (
                        <span className="text-primary [&_svg]:size-5">
                            {icon}
                        </span>
                    )}
                    <p className="text-sm font-medium">
                        {title}
                    </p>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                {visibleItems.map((item) => (
                    <div
                        key={item.label}
                        className={cn('space-y-1', item.className)}
                    >
                        <p className="text-xs text-gray-500 capitalize">
                            {item.label}
                        </p>
                        <p className="text-sm break-words">
                            {item.value ?? (
                                <span className="text-gray-500 text-xs italic">
                                    ---
                                </span>
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer */}
            {footer && (
                <div className="flex justify-end gap-2 p-4 pt-0">{footer}</div>
            )}
        </div>
    )
}
