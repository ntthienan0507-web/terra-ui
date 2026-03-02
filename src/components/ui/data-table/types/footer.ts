import type { ReactNode } from 'react'
import type { DataTableColumn, DataTableKey } from './column'

export interface DataTableFooterRow<T = any> {
    /**
     * Data for footer row cells, keyed by column key
     * Can be ReactNode or a render function
     */
    cells: Partial<
        Record<
            DataTableKey<T>,
            ReactNode | ((column: DataTableColumn<T>) => ReactNode)
        >
    >
    /**
     * Optional className for footer row
     */
    className?: string
    /**
     * Optional className for footer cells
     */
    cellClassName?: string
}
