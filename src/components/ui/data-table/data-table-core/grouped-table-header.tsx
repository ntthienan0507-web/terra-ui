import type { ReactNode } from 'react'

/** Single cell in a grouped header */
export interface GroupedHeaderCell {
    key: string
    label: ReactNode
    colSpan?: number
    rowSpan?: number
    /** Extra className (merged with base cell class) */
    className?: string
    minWidth?: string
    /** Pin cell to the left */
    sticky?: { left: string }
    /** Text alignment override */
    align?: 'left' | 'center' | 'right'
}

export interface GroupedTableHeaderProps {
    /** Array of header rows — each row is an array of cells */
    rows: GroupedHeaderCell[][]
    /** className for <thead> */
    className?: string
    /** Sticky at top inside a scrollable container */
    stickyTop?: boolean
}

const BASE_CELL = 'border border-gray-300 px-2 py-2 font-medium text-xs'

/**
 * Generic multi-row grouped <thead> component.
 * Works standalone or via DataTableCustomized's `customHeader` prop.
 *
 * @example
 * <GroupedTableHeader
 *   stickyTop
 *   rows={[
 *     [{ key: 'stt', label: 'STT', rowSpan: 2 }, { key: 'month', label: 'Jan', colSpan: 3 }],
 *     [{ key: 'r', label: 'Renewal' }, { key: 'n', label: 'New' }, { key: 'u', label: 'Upsell' }],
 *   ]}
 * />
 */
export function GroupedTableHeader({
    rows,
    className,
    stickyTop,
}: GroupedTableHeaderProps) {
    return (
        <thead
            className={className ?? 'bg-slate-50'}
            style={
                stickyTop
                    ? { position: 'sticky', top: 0, zIndex: 20 }
                    : undefined
            }
        >
            {rows.map((cells, rowIdx) => (
                <tr key={rowIdx}>
                    {cells.map((cell) => (
                        <th
                            key={cell.key}
                            colSpan={cell.colSpan}
                            rowSpan={cell.rowSpan}
                            className={`${BASE_CELL} ${cell.align === 'left' ? 'text-left' : 'text-center'} ${cell.className ?? ''}`}
                            style={{
                                ...(cell.minWidth
                                    ? { minWidth: cell.minWidth }
                                    : {}),
                                ...(cell.sticky
                                    ? {
                                          position: 'sticky' as const,
                                          left: cell.sticky.left,
                                          zIndex: 10,
                                      }
                                    : {}),
                            }}
                        >
                            {cell.label}
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
    )
}
