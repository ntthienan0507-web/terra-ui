import type { ReactNode } from 'react'

// Export all types
export * from './types'
export * from './helpers'

// Import formatters
import { renderChipFormatter } from './chip-formatter'
import { renderLinkFormatter } from './link-formatter'
import { renderDateFormatter } from './date-formatter'
import {
    renderNumberFormatter,
    renderCurrencyFormatter,
    renderBadgeFormatter,
    renderBooleanFormatter,
    renderAvatarFormatter,
    renderTimeRangeFormatter,
    renderOptionsFormatter,
} from './other-formatters'

// Re-export individual formatter renderers
export {
    renderChipFormatter,
    renderLinkFormatter,
    renderDateFormatter,
    renderNumberFormatter,
    renderCurrencyFormatter,
    renderBadgeFormatter,
    renderBooleanFormatter,
    renderAvatarFormatter,
    renderTimeRangeFormatter,
    renderOptionsFormatter,
}

import type { FormatterConfig } from './types'

/**
 * Main formatter renderer - delegates to specific formatter
 */
export function renderFormatter<T = any>(
    value: any,
    row: T,
    config: FormatterConfig<T>
): ReactNode {
    switch (config.type) {
        case 'chip':
            return renderChipFormatter(value, row, config)
        case 'link':
            return renderLinkFormatter(value, row, config)
        case 'date':
            return renderDateFormatter(value, row, config)
        case 'number':
            return renderNumberFormatter(value, row, config)
        case 'currency':
            return renderCurrencyFormatter(value, row, config)
        case 'badge':
            return renderBadgeFormatter(value, row, config)
        case 'boolean':
            return renderBooleanFormatter(value, row, config)
        case 'avatar':
            return renderAvatarFormatter(value, row, config)
        case 'timerange':
            return renderTimeRangeFormatter(value, row, config)
        case 'options':
            return renderOptionsFormatter(value, row, config)
        default:
            return value
    }
}
