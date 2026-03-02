import { Skeleton } from './base'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../table'
import { cn } from '../../../lib/utils'

interface SkeletonTableProps {
    /** Number of rows to display */
    rows?: number
    /** Number of columns to display */
    columns?: number
    /** Column widths (optional) - can be number (px) or string (e.g., '100px', '20%') */
    columnWidths?: (number | string)[]
    /** Show header skeleton */
    showHeader?: boolean
    /** Row height class */
    rowHeight?: 'sm' | 'md' | 'lg'
    /** Additional className */
    className?: string
}

/**
 * SkeletonTable - Loading skeleton for DataTableCustomized
 * Use with useQueryWithHandler when placeholderData is true
 *
 * @example
 * // Basic usage
 * <SkeletonTable rows={5} columns={4} />
 *
 * @example
 * // With custom column widths
 * <SkeletonTable
 *     rows={10}
 *     columns={5}
 *     columnWidths={[80, 200, 150, 100, 120]}
 * />
 *
 * @example
 * // With useQueryWithHandler
 * const { data, isLoading, renderState } = useQueryWithHandler({
 *     queryKey: [QUERY_KEYS.EMPLOYEES, queryParams],
 *     queryFn: () => getEmployees(queryParams),
 *     placeholderData: true,
 * }, {
 *     loadingComponent: <SkeletonTable rows={10} columns={6} />
 * })
 */
export function SkeletonTable({
    rows = 5,
    columns = 4,
    columnWidths,
    showHeader = true,
    rowHeight = 'md',
    className,
}: SkeletonTableProps) {
    const rowHeightClass = {
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
    }[rowHeight]

    const getColumnWidth = (index: number): string | number | undefined => {
        if (!columnWidths || index >= columnWidths.length) return undefined
        const width = columnWidths[index]
        return typeof width === 'number' ? `${width}px` : width
    }

    return (
        <div
            className={cn(
                'border rounded-sm overflow-hidden bg-white',
                className
            )}
        >
            <Table>
                {showHeader && (
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            {Array.from({ length: columns }).map((_, i) => (
                                <TableHead
                                    key={i}
                                    style={{ width: getColumnWidth(i) }}
                                    className="px-3 py-2"
                                >
                                    <Skeleton className="h-4 w-3/4" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                )}
                <TableBody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex} className={rowHeightClass}>
                            {Array.from({ length: columns }).map(
                                (_, colIndex) => (
                                    <TableCell
                                        key={colIndex}
                                        style={{
                                            width: getColumnWidth(colIndex),
                                        }}
                                        className="px-3 py-2"
                                    >
                                        <Skeleton
                                            className={cn(
                                                'h-4',
                                                // Vary widths for visual interest
                                                colIndex === 0
                                                    ? 'w-16'
                                                    : colIndex === columns - 1
                                                      ? 'w-20'
                                                      : 'w-full'
                                            )}
                                        />
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
