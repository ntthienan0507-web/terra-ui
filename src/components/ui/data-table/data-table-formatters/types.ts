import type { ReactNode } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export type ChipVariant =
    | 'default'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'primary'
    | 'secondary'

export type ChipSize = 'sm' | 'md' | 'lg'

export interface ChipColorConfig {
    /** Display label - if not provided, use the raw value */
    label?: string
    /** Chip color variant */
    color: ChipVariant
    /** Optional icon to show before label */
    icon?: ReactNode
    /** Optional custom className */
    className?: string
}

export interface ChipFormatterConfig<T = any> {
    type: 'chip'
    /**
     * Mapping from value to chip configuration
     * Can be a static map or a function that returns the config
     */
    colorMap:
        | Record<string, ChipColorConfig>
        | ((value: any, row: T) => ChipColorConfig | undefined)
    /**
     * Default config for values not in colorMap
     * If not provided, will show raw value with 'default' variant
     */
    defaultConfig?: ChipColorConfig
    /** Chip size */
    size?: ChipSize
    /**
     * Whether to show dot indicator before label
     * @default false
     */
    showDot?: boolean
    /** Custom className for the chip container */
    className?: string
    /**
     * Render mode
     * - 'chip': Full chip with background color
     * - 'badge': Minimal badge style (small, no padding)
     * - 'dot': Just a colored dot with text
     * @default 'chip'
     */
    variant?: 'chip' | 'badge' | 'dot'
    /**
     * Text transform
     * @default 'none'
     */
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
    /**
     * Whether chip is clickable (shows hover effect)
     * @default false
     */
    clickable?: boolean
    /**
     * Click handler for clickable chips
     */
    onClick?: (value: any, row: T) => void
    /**
     * Tooltip text to show on hover
     * Can be a string or a function that returns string
     */
    tooltip?: string | ((value: any, row: T) => string)
}

export interface LinkFormatterConfig<T = any> {
    type: 'link'
    /**
     * Link URL - can be static or dynamic
     * @example href: '/users/123'
     * @example href: (value, row) => `/users/${row.id}`
     */
    href: string | ((value: any, row: T) => string)
    /** Link target */
    target?: '_blank' | '_self' | '_parent' | '_top'
    /** Custom className */
    className?: string
    /** Optional icon before/after text */
    icon?: ReactNode
    iconPosition?: 'before' | 'after'
    /**
     * Custom label to display (instead of cell value)
     * Can be static string or function that receives (value, row)
     * @example label: (value) => `Invoice #${value}`
     */
    label?: string | ((value: any, row: T) => string)
    /**
     * Custom render function for the link element.
     * Use this for SPA routing (e.g., Next.js Link, React Router Link).
     * When not provided, a plain `<a>` tag is rendered.
     * @example renderLink: ({ href, className, children }) => <Link to={href} className={className}>{children}</Link>
     */
    renderLink?: (props: {
        href: string
        className: string
        children: React.ReactNode
    }) => React.ReactNode
}

export interface DateFormatterConfig {
    type: 'date'
    /** Date format using dayjs format tokens */
    format?: string
    /** Show relative time (e.g., "2 days ago") instead of formatted date */
    fromNow?: boolean
    /** Locale for date formatting */
    locale?: string
    /**
     * Timezone handling
     * - 'utc': Parse and display in UTC (no conversion)
     * - 'local': Convert to local timezone (default)
     * - string: Specific timezone (e.g., 'Asia/Ho_Chi_Minh', 'America/New_York')
     * @default 'local'
     */
    timezone?: 'utc' | 'local' | string
}

export interface NumberFormatterConfig {
    type: 'number'
    /** Number of decimal places */
    decimals?: number
    /** Thousand separator */
    thousandSeparator?: string
    /** Decimal separator */
    decimalSeparator?: string
    /** Prefix (e.g., "$") */
    prefix?: string
    /** Suffix (e.g., "VND") */
    suffix?: string
    /** Custom className */
    className?: string
}

export interface CurrencyFormatterConfig {
    type: 'currency'
    /**
     * Currency code or symbol
     * @example 'VND', 'USD', '$', '₫'
     */
    currency: string
    /**
     * Currency symbol position
     * - 'prefix': Symbol before number (e.g., "$100")
     * - 'suffix': Symbol after number (e.g., "100 VND")
     * @default 'suffix'
     */
    position?: 'prefix' | 'suffix'
    /** Number of decimal places (default: 0 for VND, 2 for others) */
    decimals?: number
    /** Thousand separator (default: ',') */
    thousandSeparator?: string
    /** Decimal separator (default: '.') */
    decimalSeparator?: string
    /** Custom className */
    className?: string
    /**
     * Show zero as dash instead of "0 VND"
     * @default false
     */
    hideZero?: boolean
}

export interface BadgeFormatterConfig {
    type: 'badge'
    /** Badge variant */
    variant?:
        | 'default'
        | 'primary'
        | 'success'
        | 'warning'
        | 'error'
        | 'secondary'
    /** Show badge even when value is 0 */
    showZero?: boolean
}

export interface BooleanFormatterConfig {
    type: 'boolean'
    /** Display mode */
    display?: 'checkbox' | 'text' | 'icon'
    /** Label for true value (text mode) */
    trueLabel?: string
    /** Label for false value (text mode) */
    falseLabel?: string
    /** Icons for icon mode */
    trueIcon?: ReactNode
    falseIcon?: ReactNode
}

export interface AvatarFormatterConfig {
    type: 'avatar'
    /** Key in row data for image URL */
    imageKey?: string
    /** Fallback when no image */
    fallback?: 'initials' | 'icon'
    /** Size */
    size?: 'sm' | 'md' | 'lg'
}

export interface TimeRangeFormatterConfig {
    type: 'timerange'
    /** Key in row data for start time */
    startKey: string
    /** Key in row data for end time */
    endKey: string
    /**
     * Default format for both start and end time
     * @default 'HH:mm'
     */
    format?: string
    /**
     * Custom format for start time (overrides format)
     */
    startFormat?: string
    /**
     * Custom format for end time (overrides format)
     */
    endFormat?: string
    /**
     * Separator between start and end
     * @default ' - '
     */
    separator?: string
    /** Custom className */
    className?: string
    /**
     * Show empty placeholder when both values are empty
     * @default '-'
     */
    emptyPlaceholder?: string
    /**
     * Timezone handling
     * - 'utc': Parse and display in UTC (no conversion)
     * - 'local': Convert to local timezone (default)
     * - string: Specific timezone (e.g., 'Asia/Ho_Chi_Minh', 'America/New_York')
     * @default 'local'
     */
    timezone?: 'utc' | 'local' | string
    /**
     * Smart year display - automatically remove year from start date if same as end date year
     * Requires format to contain year tokens (YYYY or YY)
     * @example
     * - format: 'DD/MM/YYYY' + smartYear: true
     * - Same year: '01/01 - 31/12/2024' (year removed from start)
     * - Different years: '01/12/2023 - 31/01/2024' (both show year)
     * @default false
     */
    smartYear?: boolean
}

export interface OptionItem {
    /** Option value - must match the cell value */
    value: string | number | boolean
    /** Display label */
    label: string
    /** Chip color variant (optional, defaults to 'default') */
    color?: ChipVariant
    /** Optional icon */
    icon?: ReactNode
}

export interface OptionsFormatterConfig {
    type: 'options'
    /**
     * Array of options to map values to labels/colors
     * Each option must have value and label, color is optional
     */
    options: OptionItem[]
    /**
     * Fallback value to show when no match found
     * @default Shows raw value with 'default' variant
     */
    fallbackValue?: string
    /**
     * Render mode
     * - 'chip': Render as chip/badge (uses variant, size, color)
     * - 'text': Render as plain text (only uses label, ignores color/icon)
     * @default 'chip'
     */
    renderMode?: 'chip' | 'text'
    /** Chip size (only used when renderMode='chip') */
    size?: ChipSize
    /**
     * Whether to show dot indicator before label (only used when renderMode='chip')
     * @default false
     */
    showDot?: boolean
    /** Custom className */
    className?: string
    /**
     * Chip variant (only used when renderMode='chip')
     * - 'chip': Full chip with background color (default)
     * - 'badge': Minimal badge style
     * - 'dot': Just a colored dot with text
     * @default 'chip'
     */
    variant?: 'chip' | 'badge' | 'dot'
    /**
     * Text transform
     * @default 'none'
     */
    textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
}

export type FormatterConfig<T = any> =
    | ChipFormatterConfig<T>
    | LinkFormatterConfig<T>
    | DateFormatterConfig
    | NumberFormatterConfig
    | CurrencyFormatterConfig
    | BadgeFormatterConfig
    | BooleanFormatterConfig
    | AvatarFormatterConfig
    | TimeRangeFormatterConfig
    | OptionsFormatterConfig
