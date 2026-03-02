import type { ReactNode } from 'react'
import { cn } from '../../../../lib/utils'
import type { LinkFormatterConfig } from './types'

/**
 * Render link formatter
 * Uses plain <a> tags by default. For SPA routing, provide `renderLink` callback.
 */
export function renderLinkFormatter<T = any>(
    value: any,
    row: T,
    config: LinkFormatterConfig<T>
): ReactNode {
    const {
        href,
        target,
        className,
        icon,
        iconPosition = 'after',
        label,
        renderLink,
    } = config

    // Generate URL
    const url = typeof href === 'function' ? href(value, row) : href

    // Use custom label if provided, otherwise use value or url
    const displayValue = label
        ? typeof label === 'function'
            ? label(value, row)
            : label
        : value || url

    const linkContent = (
        <>
            {icon && iconPosition === 'before' && (
                <span className="mr-1">{icon}</span>
            )}
            {displayValue}
            {icon && iconPosition === 'after' && (
                <span className="ml-1">{icon}</span>
            )}
        </>
    )

    const linkClassName = cn(
        'text-primary hover:text-primary-hover hover:underline',
        className
    )

    // Use custom renderLink for SPA routing if provided
    if (renderLink) {
        return renderLink({
            href: url,
            className: linkClassName,
            children: linkContent,
        })
    }

    // Default: render plain <a> tag
    return (
        <a
            href={url}
            target={target}
            rel={target === '_blank' ? 'noopener noreferrer' : undefined}
            className={linkClassName}
        >
            {linkContent}
        </a>
    )
}
