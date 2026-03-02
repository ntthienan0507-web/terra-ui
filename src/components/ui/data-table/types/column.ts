import type { ReactNode } from 'react'
import type { FormatterConfig } from '../data-table-formatters'

/**
 * Helper type to extract keys from a type T, excluding special keys
 * This helps with type-safe column definitions
 */
export type DataTableKey<T> =
    | keyof T
    | '__index__'
    | '__selection__'
    | 'actions'
    | (string & {})

export interface DataTableColumn<T = any> {
    /**
     * Column identifier key - can be a key of T or a special key like "__index__"
     * TypeScript will provide autocomplete for keys of T
     */
    key: DataTableKey<T>
    /**
     * Column header title
     */
    title: string | ReactNode
    /**
     * Optional className for the column header
     */
    headerClassName?: string
    /**
     * Optional className for the column cells
     */
    cellClassName?: string
    /**
     * Optional formatter for common patterns (chip, link, date, number, etc.)
     * If both formatter and render are provided, render takes precedence
     * @example
     * formatter: { type: 'chip', colorMap: { ... } }
     * @example
     * formatter: { type: 'date', format: 'DD/MM/YYYY' }
     */
    formatter?: FormatterConfig<T>
    /**
     * Optional value getter to transform raw cell value before render/formatter
     * @param row - The entire row data
     * @param index - Row index
     * @returns Transformed value passed to render/formatter
     */
    valueGetter?: (row: T, index: number) => any
    /**
     * Optional render function to customize cell content
     * Takes precedence over formatter if both are provided
     * @param value - The value from the row data (or valueGetter result)
     * @param row - The entire row data
     * @param index - Row index
     */
    render?: (value: any, row: T, index: number) => ReactNode
    /**
     * Optional width for the column
     */
    width?: number
    /**
     * Enable sorting for this column
     * When true, clicking header will trigger onSortChange
     * @default false
     */
    sortable?: boolean
    /**
     * Optional flag to hide the column
     * Can be a boolean or a function that receives column data and all rows data
     * @default false
     */
    hidden?: boolean | ((column: DataTableColumn<T>, rows: T[]) => boolean)
    /**
     * Pin column to left or right side
     * Pinned columns stay visible when scrolling horizontally
     * Default: 'actions' key is pinned to 'right' automatically
     */
    pinned?: 'left' | 'right'
}
