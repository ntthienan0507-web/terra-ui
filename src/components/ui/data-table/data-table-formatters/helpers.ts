import type {
    LinkFormatterConfig,
    ChipFormatterConfig,
    DateFormatterConfig,
    TimeRangeFormatterConfig,
    NumberFormatterConfig,
    CurrencyFormatterConfig,
    OptionsFormatterConfig,
} from './types'

// ============================================================================
// FORMATTER HELPERS - For better type inference and autocomplete
// ============================================================================

/**
 * Helper to create link formatter
 * @example
 * createLinkFormatter<Invoice>({
 *   href: (value, row) => `/invoices/${row.id}`,
 *   target: '_blank'
 * })
 */
export function createLinkFormatter<T = any>(
    config: Omit<LinkFormatterConfig<T>, 'type'>
): LinkFormatterConfig<T> {
    return {
        type: 'link',
        ...config,
    }
}

/**
 * Helper to create chip formatter
 * @example
 * createChipFormatter<Invoice>({
 *   colorMap: (value, row) => ({ color: row.status === 'active' ? 'success' : 'error' })
 * })
 */
export function createChipFormatter<T = any>(
    config: Omit<ChipFormatterConfig<T>, 'type'>
): ChipFormatterConfig<T> {
    return {
        type: 'chip',
        ...config,
    }
}

/**
 * Helper to create date formatter
 */
export function createDateFormatter(
    config: Omit<DateFormatterConfig, 'type'>
): DateFormatterConfig {
    return {
        type: 'date',
        ...config,
    }
}

/**
 * Helper to create timerange formatter
 */
export function createTimeRangeFormatter(
    config: Omit<TimeRangeFormatterConfig, 'type'>
): TimeRangeFormatterConfig {
    return {
        type: 'timerange',
        ...config,
    }
}

/**
 * Helper to create number formatter
 */
export function createNumberFormatter(
    config: Omit<NumberFormatterConfig, 'type'>
): NumberFormatterConfig {
    return {
        type: 'number',
        ...config,
    }
}

/**
 * Helper to create currency formatter
 * @example
 * createCurrencyFormatter({ currency: 'VND' })
 * createCurrencyFormatter({ currency: '$', position: 'prefix', decimals: 2 })
 */
export function createCurrencyFormatter(
    config: Omit<CurrencyFormatterConfig, 'type'>
): CurrencyFormatterConfig {
    return {
        type: 'currency',
        decimals: 0,
        ...config,
    }
}

/**
 * Helper to create options formatter
 * Maps values to labels/colors from an options array
 * @example
 * createOptionsFormatter({
 *   options: TRANSACTION_PAYMENT_METHODS
 * })
 */
export function createOptionsFormatter(
    config: Omit<OptionsFormatterConfig, 'type'>
): OptionsFormatterConfig {
    return {
        type: 'options',
        ...config,
    }
}
